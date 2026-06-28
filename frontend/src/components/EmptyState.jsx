import React from 'react';

export default function EmptyState({ filtered, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {filtered ? (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ) : (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        )}
      </div>
      <h3 className="empty-state__title">
        {filtered ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="empty-state__subtitle">
        {filtered
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Create your first task to start tracking your work.'}
      </p>
      {!filtered && (
        <button className="btn btn--primary" onClick={onAdd}>
          + Create Your First Task
        </button>
      )}
    </div>
  );
}
