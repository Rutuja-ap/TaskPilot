import React from 'react';
import { useTaskForm } from '../hooks/useTaskForm';
import { useTasks } from '../context/TaskContext';

export default function TaskForm({ task, onClose }) {
  const isEditing = Boolean(task);
  const { createTask, updateTask, submitting } = useTasks();
  const { form, errors, handleChange, validate, toPayload, populate } = useTaskForm();

  // Populate form when editing
  React.useEffect(() => {
    if (task) populate(task);
  }, [task, populate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = toPayload();
    const ok = isEditing
      ? await updateTask(task._id, payload)
      : await createTask(payload);
    if (ok) onClose();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
          autoFocus
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
        <p className="form-hint">{form.title.length}/100</p>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
          placeholder="Add details (optional)"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
          rows={3}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
        <p className="form-hint">{form.description.length}/500</p>
      </div>

      {/* Status + Priority row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="form-input form-select"
            value={form.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            className="form-input form-select"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label className="form-label" htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          className={`form-input ${errors.dueDate ? 'form-input--error' : ''}`}
          value={form.dueDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label" htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          type="text"
          className="form-input"
          placeholder="design, frontend, urgent (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />
        <p className="form-hint">Separate tags with commas</p>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? (
            <span className="btn-spinner">
              <span className="spinner" />
              {isEditing ? 'Saving…' : 'Creating…'}
            </span>
          ) : (
            isEditing ? 'Save Changes' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
}
