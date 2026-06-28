import React, { useState } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { StatusBadge, PriorityBadge } from './Badge';
import { useTasks } from '../context/TaskContext';

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, updateStatus } = useTasks();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await deleteTask(task._id);
  };

  const handleStatusCycle = async () => {
    const cycle = { 'todo': 'in-progress', 'in-progress': 'completed', 'completed': 'todo' };
    await updateStatus(task._id, cycle[task.status]);
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div className={`task-card task-card--${task.priority} ${task.status === 'completed' ? 'task-card--done' : ''}`}>
      {/* Priority indicator bar */}
      <div className={`task-card__bar task-card__bar--${task.priority}`} />

      <div className="task-card__content">
        {/* Header */}
        <div className="task-card__header">
          <h3 className={`task-card__title ${task.status === 'completed' ? 'task-card__title--done' : ''}`}>
            {task.title}
          </h3>
          <div className="task-card__badges">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="task-card__tags">
            {task.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="task-card__footer">
          <div className="task-card__meta">
            {task.dueDate && (
              <span className={`task-card__due ${isOverdue ? 'task-card__due--overdue' : ''} ${isDueToday ? 'task-card__due--today' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {isOverdue ? '⚠ Overdue · ' : isDueToday ? '📅 Due today · ' : ''}
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            <span className="task-card__created">
              {format(new Date(task.createdAt), 'MMM d')}
            </span>
          </div>

          {/* Actions */}
          <div className="task-card__actions">
            <button
              className="btn-icon btn-icon--cycle"
              onClick={handleStatusCycle}
              title="Cycle status"
              aria-label="Change status"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
            <button
              className="btn-icon btn-icon--edit"
              onClick={() => onEdit(task)}
              title="Edit task"
              aria-label="Edit task"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className={`btn-icon ${confirmDelete ? 'btn-icon--confirm-delete' : 'btn-icon--delete'}`}
              onClick={handleDelete}
              title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
              aria-label="Delete task"
            >
              {confirmDelete ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
