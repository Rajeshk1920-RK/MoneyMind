import React from 'react';
import { X, Bell, Check, Trash2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export function NotificationsDrawer({ isOpen, onClose }) {
  const {
    notifications,
    markAllNotificationsRead,
    clearNotification
  } = useFinance();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Notification Center</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notifications.some(n => !n.read) && (
              <button
                onClick={markAllNotificationsRead}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
              >
                Mark Read
              </button>
            )}
            <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              No notifications. You are all caught up!
            </div>
          ) : (
            notifications.map(n => {
              const isWarning = n.type === 'warning';
              const isSuccess = n.type === 'success';

              return (
                <div
                  key={n.id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: n.read ? 'var(--bg-input)' : 'var(--bg-card)',
                    border: `1px solid ${!n.read ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isWarning ? 'rgba(245, 158, 11, 0.15)' : isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: isWarning ? 'var(--accent-warning)' : isSuccess ? 'var(--accent-income)' : 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isWarning ? <AlertTriangle size={16} /> : isSuccess ? <CheckCircle2 size={16} /> : <Info size={16} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
                      {n.timestamp}
                    </div>
                  </div>

                  <button
                    onClick={() => clearNotification(n.id)}
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', color: 'var(--text-tertiary)' }}
                    title="Dismiss"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}