import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import { ensureDatabaseExists, initTables, pool } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Direct Full 43.59 MB Android APK Download Route
app.get(['/api/download-apk', '/download-apk'], (req, res) => {
  const possiblePaths = [
    path.join(__dirname, '../public/MoneyMind-v1.0.apk'),
    path.join(__dirname, '../public/moneymind-v1.0.apk'),
    path.join(__dirname, '../public/app-debug.apk'),
    path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk')
  ];

  for (const apkPath of possiblePaths) {
    if (fs.existsSync(apkPath)) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment; filename="MoneyMind-v1.0.apk"');
      return res.sendFile(path.resolve(apkPath));
    }
  }

  res.status(404).send('APK file not found.');
});

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// In-memory fallback supporting recent OTP codes (prevents race conditions)
const memOtps = new Map(); // cleanEmail -> Array of { otp, expiresAt }
const memUsers = new Map();

// Simple password hashing helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// 0A. Send 6-Digit Email OTP (Resend)
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  try {
    // 1. Store in memory list (all codes in last 15 min are valid to prevent race conditions)
    const existingList = memOtps.get(cleanEmail) || [];
    const activeList = existingList.filter(item => item.expiresAt > Date.now());
    activeList.push({ otp: String(otp).trim(), expiresAt });
    memOtps.set(cleanEmail, activeList);

    // 2. Also try storing in PostgreSQL
    try {
      await pool.query(
        `INSERT INTO otps (email, otp, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (email)
         DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at`,
        [cleanEmail, otp, new Date(expiresAt)]
      );
    } catch (dbErr) {
      // Memory fallback is already active
    }

    // 3. Send email via Resend
    if (resend) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: cleanEmail,
        subject: `${otp} is your Modern Mind Verification Code`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e3ebe5; border-radius: 16px; background-color: #ffffff;">
            <h2 style="color: #131826; margin-top: 0;">Modern Mind Verification</h2>
            <p style="color: #55657a; font-size: 15px;">Your 6-digit verification code is:</p>
            <div style="font-size: 34px; font-weight: 800; letter-spacing: 6px; color: #2563eb; background-color: #f1f5fa; padding: 14px 20px; text-align: center; border-radius: 10px; margin: 20px 0; border: 1px solid #d4e0f0;">
              ${otp}
            </div>
            <p style="color: #748296; font-size: 13px;">This code will expire in 15 minutes. If you did not request this, you can safely ignore this email.</p>
          </div>
        `
      });
      console.log(`[Resend Email] Successfully sent OTP ${otp} to ${cleanEmail}`);
    } else {
      console.log(`[OTP Notice] Test OTP for ${cleanEmail}: ${otp}`);
    }

    res.json({
      success: true,
      message: `6-digit verification code sent to ${cleanEmail}`,
      devOtp: !resend ? otp : undefined
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: err.message || 'Failed to send OTP' });
  }
});

// 0B. Verify 6-Digit Email OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp, fullName } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = String(otp || '').replace(/\D/g, '').trim();

  try {
    let verified = false;

    // 1. Check in-memory active OTP codes list
    const list = memOtps.get(cleanEmail) || [];
    console.log(`[Verify Check] Checking email: "${cleanEmail}", submitted: "${cleanOtp}", active codes:`, list.map(x => x.otp));

    const matchIndex = list.findIndex(item => item.otp === cleanOtp && item.expiresAt > Date.now());
    if (matchIndex !== -1) {
      verified = true;
      list.splice(matchIndex, 1);
      memOtps.set(cleanEmail, list);
      console.log(`[Verify Success] Code "${cleanOtp}" matched successfully for ${cleanEmail}!`);
    }

    // 2. Fallback to PostgreSQL
    if (!verified) {
      try {
        const result = await pool.query(
          `SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()`,
          [cleanEmail, cleanOtp]
        );
        if (result.rowCount > 0) {
          verified = true;
          await pool.query('DELETE FROM otps WHERE email = $1', [cleanEmail]);
        }
      } catch (dbErr) {
        // ignore
      }
    }

    if (!verified) {
      console.warn(`[Verify Failed] Code "${cleanOtp}" was not found or expired for ${cleanEmail}.`);
      return res.status(400).json({ error: 'Invalid or expired OTP code. Please check your latest email and try again.' });
    }

    // Find or create user
    let user = null;
    try {
      const userRes = await pool.query('SELECT id, full_name, email, avatar, currency, created_at FROM users WHERE email = $1', [cleanEmail]);
      if (userRes.rowCount > 0) {
        user = userRes.rows[0];
      } else {
        const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const name = fullName?.trim() || cleanEmail.split('@')[0];
        const avatar = name.slice(0, 2).toUpperCase();
        const insertRes = await pool.query(
          `INSERT INTO users (id, full_name, email, password_hash, avatar, currency)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, full_name, email, avatar, currency, created_at`,
          [userId, name, cleanEmail, 'OTP_VERIFIED', avatar, 'USD']
        );
        user = insertRes.rows[0];
      }
    } catch (dbErr) {
      if (memUsers.has(cleanEmail)) {
        user = memUsers.get(cleanEmail);
      } else {
        const name = fullName?.trim() || cleanEmail.split('@')[0];
        user = {
          id: `usr_${Date.now()}`,
          full_name: name,
          email: cleanEmail,
          avatar: name.slice(0, 2).toUpperCase(),
          currency: 'USD'
        };
        memUsers.set(cleanEmail, user);
      }
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: err.message || 'Database error during OTP verification' });
  }
});


// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ error: 'This email is already registered. Please sign in.' });
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const name = fullName?.trim() || email.split('@')[0];
    const avatar = name.slice(0, 2).toUpperCase();
    const pwHash = hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (id, full_name, email, password_hash, avatar, currency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, avatar, currency, created_at`,
      [userId, name, email.toLowerCase().trim(), pwHash, avatar, 'INR']
    );

    const user = result.rows[0];
    res.json({ success: true, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message || 'Database error during registration' });
  }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const pwHash = hashPassword(password);
    const result = await pool.query(
      `SELECT id, full_name, email, avatar, currency, created_at 
       FROM users 
       WHERE email = $1 AND password_hash = $2`,
      [email.toLowerCase().trim(), pwHash]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const user = result.rows[0];
    res.json({ success: true, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Database error during login' });
  }
});

// 3. Get User Finances (Transactions, Budgets, Goals)
app.get('/api/finances/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const txs = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC', [userId]);
    const budgets = await pool.query('SELECT * FROM budgets WHERE user_id = $1', [userId]);
    const goals = await pool.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY target_date ASC', [userId]);

    res.json({
      transactions: txs.rows.map(t => ({
        id: t.id,
        title: t.title,
        merchant: t.merchant || t.title,
        amount: Number(t.amount),
        type: t.type,
        category: t.category,
        paymentMethod: t.payment_method,
        date: t.date ? t.date.toISOString().split('T')[0] : '',
        notes: t.notes || '',
        note: t.notes || '',
        tags: t.tags || [],
        intentCategory: t.intent_category,
        intentNote: t.intent_note,
        intentFor: t.intent_for,
        intentCaptured: Boolean(t.intent_captured),
        source: t.source || 'manual',
        paymentStatus: t.payment_status || 'success'
      })),
      budgets: budgets.rows.map(b => ({
        id: b.id,
        category: b.category,
        monthlyLimit: Number(b.monthly_limit),
        alertThreshold: Number(b.alert_threshold) || 80
      })),
      goals: goals.rows.map(g => ({
        id: g.id,
        title: g.title,
        targetAmount: Number(g.target_amount),
        currentAmount: Number(g.current_amount) || 0,
        targetDate: g.target_date ? g.target_date.toISOString().split('T')[0] : '',
        category: g.category,
        color: g.color || '#16382b'
      }))
    });
  } catch (err) {
    console.error('Fetch finances error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Add Transaction
app.post('/api/transactions', async (req, res) => {
  const {
    userId,
    title,
    merchant,
    amount,
    type,
    category,
    paymentMethod,
    date,
    notes,
    tags,
    intentCategory,
    intentNote,
    intentFor,
    intentCaptured,
    source,
    paymentStatus
  } = req.body;
  const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  try {
    const result = await pool.query(
      `INSERT INTO transactions (
        id, user_id, title, merchant, amount, type, category, payment_method, date, notes, tags,
        intent_category, intent_note, intent_for, intent_captured, source, payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        id,
        userId,
        title,
        merchant || title,
        amount,
        type,
        category,
        paymentMethod || 'UPI',
        date,
        notes || '',
        tags || [],
        intentCategory || null,
        intentNote || '',
        intentFor || '',
        Boolean(intentCaptured),
        source || 'manual',
        paymentStatus || 'success'
      ]
    );

    const t = result.rows[0];
    res.json({
      id: t.id,
      title: t.title,
      merchant: t.merchant || t.title,
      amount: Number(t.amount),
      type: t.type,
      category: t.category,
      paymentMethod: t.payment_method,
      date: t.date ? t.date.toISOString().split('T')[0] : '',
      notes: t.notes || '',
      note: t.notes || '',
      tags: t.tags || [],
      intentCategory: t.intent_category,
      intentNote: t.intent_note,
      intentFor: t.intent_for,
      intentCaptured: Boolean(t.intent_captured),
      source: t.source || 'manual',
      paymentStatus: t.payment_status || 'success'
    });
  } catch (err) {
    console.error('Insert transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4B. Update Transaction Payment Intent
app.patch('/api/transactions/:id/intent', async (req, res) => {
  const { id } = req.params;
  const { category, intentCategory, intentNote, intentFor, intentCaptured, note } = req.body;

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET category = COALESCE($1, category),
           intent_category = COALESCE($2, intent_category),
           intent_note = COALESCE($3, intent_note),
           intent_for = COALESCE($4, intent_for),
           intent_captured = COALESCE($5, intent_captured),
           notes = COALESCE($6, notes)
       WHERE id = $7
       RETURNING *`,
      [
        category,
        intentCategory || category,
        intentNote,
        intentFor,
        intentCaptured !== undefined ? Boolean(intentCaptured) : true,
        note,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const t = result.rows[0];
    res.json({
      id: t.id,
      title: t.title,
      merchant: t.merchant || t.title,
      amount: Number(t.amount),
      type: t.type,
      category: t.category,
      paymentMethod: t.payment_method,
      date: t.date ? t.date.toISOString().split('T')[0] : '',
      notes: t.notes || '',
      tags: t.tags || [],
      intentCategory: t.intent_category,
      intentNote: t.intent_note,
      intentFor: t.intent_for,
      intentCaptured: Boolean(t.intent_captured)
    });
  } catch (err) {
    console.error('Update payment intent error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete Transaction
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Save or Update Budget
app.post('/api/budgets', async (req, res) => {
  const { userId, category, monthlyLimit, alertThreshold } = req.body;
  const id = `b_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  try {
    const result = await pool.query(
      `INSERT INTO budgets (id, user_id, category, monthly_limit, alert_threshold)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, category) 
       DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit, alert_threshold = EXCLUDED.alert_threshold
       RETURNING *`,
      [id, userId, category, monthlyLimit, alertThreshold || 80]
    );

    const b = result.rows[0];
    res.json({
      id: b.id,
      category: b.category,
      monthlyLimit: Number(b.monthly_limit),
      alertThreshold: Number(b.alert_threshold)
    });
  } catch (err) {
    console.error('Save budget error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Save Goal
app.post('/api/goals', async (req, res) => {
  const { userId, title, targetAmount, currentAmount, targetDate, category, color } = req.body;
  const id = `g_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  try {
    const result = await pool.query(
      `INSERT INTO goals (id, user_id, title, target_amount, current_amount, target_date, category, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, userId, title, targetAmount, currentAmount || 0, targetDate, category || 'Safety Net', color || '#16382b']
    );

    const g = result.rows[0];
    res.json({
      id: g.id,
      title: g.title,
      targetAmount: Number(g.target_amount),
      currentAmount: Number(g.current_amount),
      targetDate: g.target_date ? g.target_date.toISOString().split('T')[0] : '',
      category: g.category,
      color: g.color
    });
  } catch (err) {
    console.error('Save goal error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Contribute to Goal
app.post('/api/goals/:id/contribute', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const result = await pool.query(
      `UPDATE goals 
       SET current_amount = current_amount + $1 
       WHERE id = $2 
       RETURNING *`,
      [amount, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const g = result.rows[0];
    res.json({
      id: g.id,
      title: g.title,
      targetAmount: Number(g.target_amount),
      currentAmount: Number(g.current_amount),
      targetDate: g.target_date ? g.target_date.toISOString().split('T')[0] : '',
      category: g.category,
      color: g.color
    });
  } catch (err) {
    console.error('Contribute goal error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
async function start() {
  try {
    await ensureDatabaseExists();
    await initTables();
    console.log('PostgreSQL database and tables initialized successfully!');
  } catch (err) {
    console.warn('PostgreSQL notice (using resilient in-memory storage until PG_PASSWORD is set):', err.message);
  }

  app.listen(PORT, () => {
    console.log(`MoneyMind API & Resend Backend running on http://localhost:${PORT}`);
  });
}

start();
