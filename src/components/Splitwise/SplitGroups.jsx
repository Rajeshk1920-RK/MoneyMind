import React, { useState } from 'react';
import { Plus, Users, Compass, ChevronRight, X, Check } from 'lucide-react';
import { useSplit } from '../../context/SplitContext';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';
import { GroupDetail } from './GroupDetail';

export function SplitGroups() {
  const { groups, selectedGroupId, setSelectedGroupId, createGroup } = useSplit();
  const { activeCurrency, activeCurrencyCode } = useFinance();

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [memberInputs, setMemberInputs] = useState('Rajesh (You), Rahul, Priya, Sneha');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName) return;

    const memberNames = memberInputs.split(',').map(m => m.trim()).filter(Boolean);
    const avatars = ['RK', 'AS', 'PP', 'RV', 'SK', 'AM'];

    const members = memberNames.map((name, i) => ({
      id: `mem-${Date.now()}-${i}`,
      name,
      avatar: avatars[i % avatars.length]
    }));

    createGroup({
      name: newGroupName,
      description: newGroupDesc,
      members,
      currency: activeCurrencyCode
    });

    setNewGroupName('');
    setNewGroupDesc('');
    setIsCreateGroupOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Group Selector Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>SplitSmart Groups</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Split bills with roommates, trips with friends, and settle debts with 1 click
          </p>
        </div>

        <button
          className="btn btn-split"
          onClick={() => setIsCreateGroupOpen(true)}
        >
          <Plus size={16} />
          <span>Create New Group</span>
        </button>
      </div>

      {/* Group Cards Pills */}
      <div style={{
        display: 'flex',
        gap: '0.85rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {groups.map(grp => {
          const isSelected = selectedGroupId === grp.id;
          const totalSpent = grp.expenses.filter(e => !e.isSettlement).reduce((s, e) => s + Number(e.amount), 0);

          return (
            <button
              key={grp.id}
              onClick={() => setSelectedGroupId(grp.id)}
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '16px',
                border: `1px solid ${isSelected ? 'var(--accent-split)' : 'var(--border-subtle)'}`,
                backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-card)',
                boxShadow: isSelected ? 'var(--shadow-md), 0 0 20px rgba(168, 85, 247, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexShrink: 0,
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isSelected ? 'var(--accent-split)' : 'var(--bg-input)',
                color: isSelected ? '#ffffff' : 'var(--accent-split)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                Trip
              </div>

              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {grp.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {grp.members.length} members • {formatCurrency(totalSpent, activeCurrencyCode, activeCurrency.rate)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Group Detail */}
      <GroupDetail />

      {/* Create Group Modal */}
      {isCreateGroupOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateGroupOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Create Split Group</h3>
              <button onClick={() => setIsCreateGroupOpen(false)} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manali Snow Trip, Flat 204 Roommates"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="form-control"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Cabin booking, food and ski passes"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Members (comma separated names)</label>
                <input
                  type="text"
                  required
                  placeholder="Rajesh (You), Aman, Sneha, Rohan"
                  value={memberInputs}
                  onChange={(e) => setMemberInputs(e.target.value)}
                  className="form-control"
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Separate names with commas. You can add expenses for any of these members!
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsCreateGroupOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-split">
                  <Check size={16} />
                  <span>Create Group</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}