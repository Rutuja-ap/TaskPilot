import React from 'react';
import { useTasks } from '../context/TaskContext';

function StatCard({ label, count, color, icon }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__info">
        <span className="stat-card__count">{count}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
}

export default function StatsBar() {
  const { summary } = useTasks();

  const completionRate = summary.total > 0
    ? Math.round((summary.completed / summary.total) * 100)
    : 0;

  return (
    <div className="stats-bar">
      <StatCard
        label="Total"
        count={summary.total}
        color="total"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        }
      />
      <StatCard
        label="To Do"
        count={summary.todo}
        color="todo"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      />
      <StatCard
        label="In Progress"
        count={summary.inProgress}
        color="progress"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-.05-4.79" />
          </svg>
        }
      />
      <StatCard
        label="Completed"
        count={summary.completed}
        color="done"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
      />

      {/* Progress bar */}
      <div className="stats-bar__progress">
        <div className="stats-bar__progress-label">
          <span>Completion</span>
          <span>{completionRate}%</span>
        </div>
        <div className="stats-bar__progress-track">
          <div
            className="stats-bar__progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
