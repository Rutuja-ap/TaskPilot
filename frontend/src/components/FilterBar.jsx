import React, { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function FilterBar() {
  const { filters, setFilters, fetchTasks } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  // Trigger fetch when debounced search changes
  useEffect(() => {
    const newFilters = { ...filters, search: debouncedSearch };
    setFilters({ search: debouncedSearch });
    fetchTasks(newFilters);
  }, [debouncedSearch]); // eslint-disable-line

  const handleFilter = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value, search: searchInput };
    setFilters({ [key]: value });
    fetchTasks(newFilters);
  }, [filters, searchInput, setFilters, fetchTasks]);

  const clearFilters = () => {
    setSearchInput('');
    const reset = { status: 'all', priority: 'all', search: '', sortBy: 'createdAt', order: 'desc' };
    setFilters(reset);
    fetchTasks(reset);
  };

  const isFiltered = filters.status !== 'all' || filters.priority !== 'all' || searchInput;

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-bar__search">
        <svg className="filter-bar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="filter-bar__search-input"
          placeholder="Search tasks, tags…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          aria-label="Search tasks"
        />
        {searchInput && (
          <button className="filter-bar__clear-search" onClick={() => setSearchInput('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <div className="filter-bar__controls">
        {/* Status filter */}
        <select
          className="filter-bar__select"
          value={filters.status}
          onChange={e => handleFilter('status', e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority filter */}
        <select
          className="filter-bar__select"
          value={filters.priority}
          onChange={e => handleFilter('priority', e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Sort */}
        <select
          className="filter-bar__select"
          value={`${filters.sortBy}:${filters.order}`}
          onChange={e => {
            const [sortBy, order] = e.target.value.split(':');
            handleFilter('sortBy', sortBy);
            setTimeout(() => handleFilter('order', order), 0);
          }}
          aria-label="Sort tasks"
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="dueDate:asc">Due Date ↑</option>
          <option value="dueDate:desc">Due Date ↓</option>
          <option value="priority:desc">Priority ↓</option>
          <option value="title:asc">Title A–Z</option>
        </select>

        {/* Clear */}
        {isFiltered && (
          <button className="btn btn--ghost btn--sm" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
