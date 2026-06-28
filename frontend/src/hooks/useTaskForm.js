import { useState, useCallback } from 'react';

const initialTaskForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  tags: '',
};

export function useTaskForm(initialValues = initialTaskForm) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (form.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (form.description && form.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (form.dueDate) {
      const due = new Date(form.dueDate);
      if (isNaN(due.getTime())) {
        newErrors.dueDate = 'Enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const reset = useCallback(() => {
    setForm(initialTaskForm);
    setErrors({});
  }, []);

  const populate = useCallback((task) => {
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      tags: Array.isArray(task.tags) ? task.tags.join(', ') : '',
    });
    setErrors({});
  }, []);

  // Convert form data to API payload
  const toPayload = useCallback(() => ({
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate || null,
    tags: form.tags
      ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [],
  }), [form]);

  return { form, errors, handleChange, validate, reset, populate, toPayload };
}
