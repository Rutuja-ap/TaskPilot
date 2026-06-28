import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  tasks: [],
  summary: { todo: 0, inProgress: 0, completed: 0, total: 0 },
  loading: false,
  submitting: false,
  filters: {
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  },
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, summary: action.payload.summary };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t._id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks (with current filters)
  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = { ...state.filters, ...filters };
      // Remove 'all' values — backend treats absence as "no filter"
      Object.keys(params).forEach(k => {
        if (params[k] === 'all' || params[k] === '') delete params[k];
      });
      const res = await taskAPI.getAll(params);
      dispatch({ type: 'SET_TASKS', payload: { tasks: res.data, summary: res.summary } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  // Create task
  const createTask = useCallback(async (data) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const res = await taskAPI.create(data);
      dispatch({ type: 'ADD_TASK', payload: res.data });
      toast.success('Task created!');
      // Refresh to get updated summary
      await fetchTasks();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [fetchTasks]);

  // Update task
  const updateTask = useCallback(async (id, data) => {
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    try {
      const res = await taskAPI.update(id, data);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      toast.success('Task updated!');
      await fetchTasks();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  }, [fetchTasks]);

  // Quick status update
  const updateStatus = useCallback(async (id, status) => {
    try {
      const res = await taskAPI.updateStatus(id, status);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      toast.success(`Moved to ${status.replace('-', ' ')}`);
      await fetchTasks();
    } catch (err) {
      toast.error(err.message);
    }
  }, [fetchTasks]);

  // Delete task
  const deleteTask = useCallback(async (id) => {
    try {
      await taskAPI.delete(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast.success('Task deleted');
      await fetchTasks();
    } catch (err) {
      toast.error(err.message);
    }
  }, [fetchTasks]);

  // Update filters and re-fetch
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      createTask,
      updateTask,
      updateStatus,
      deleteTask,
      setFilters,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
