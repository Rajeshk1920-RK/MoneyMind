-- MoneyMind Supabase Database Schema (Complete User Data & Activity Log)
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'INR',
  upi_vpa TEXT DEFAULT 'user@upi',
  upi_limit NUMERIC DEFAULT 50000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.profiles;
CREATE POLICY "Users can view and edit own profile" 
  ON public.profiles FOR ALL USING (auth.uid() = id);

-- Auto-create profile row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Complete Transactions & Banking SMS Activity Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL,
  payment_method TEXT DEFAULT 'UPI',
  merchant TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  tags TEXT[],
  intent_category TEXT,
  intent_note TEXT,
  intent_for TEXT,
  intent_captured BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'manual', -- 'manual' | 'sms_auto' | 'quick_upi' | 'simulated'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own transactions" ON public.transactions;
CREATE POLICY "Users can manage own transactions" 
  ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- 3. Monthly Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  monthly_limit NUMERIC NOT NULL,
  alert_threshold NUMERIC DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, category)
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own budgets" ON public.budgets;
CREATE POLICY "Users can manage own budgets" 
  ON public.budgets FOR ALL USING (auth.uid() = user_id);

-- 4. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  target_date DATE,
  category TEXT,
  color TEXT DEFAULT '#16382b',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
CREATE POLICY "Users can manage own goals" 
  ON public.goals FOR ALL USING (auth.uid() = user_id);

-- 5. User Activity Logs (Tracks Every Action, Transfer & Event)
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'transaction_added', 'upi_transfer', 'sms_parsed', 'goal_contributed', 'budget_set', etc.
  title TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.user_activities;
CREATE POLICY "Users can view own activity logs" 
  ON public.user_activities FOR ALL USING (auth.uid() = user_id);

-- 6. User Notifications & Alerts Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  unread BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" 
  ON public.notifications FOR ALL USING (auth.uid() = user_id);
