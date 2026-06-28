import React from 'react';

const STATUS_STYLES = {
  'todo': 'badge--todo',
  'in-progress': 'badge--inprogress',
  'completed': 'badge--completed',
};

const PRIORITY_STYLES = {
  low: 'badge--low',
  medium: 'badge--medium',
  high: 'badge--high',
};

const STATUS_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] || ''}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${PRIORITY_STYLES[priority] || ''}`}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
}
