import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import StatsBar from '../components/StatsBar';
import EmptyState from '../components/EmptyState';

export default function HomePage() {
  const { tasks, loading, filters, fetchTasks } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch on mount
  useEffect(() => { fetchTasks(); }, []); // eslint-disable-line

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const isFiltered = filters.status !== 'all' || filters.priority !== 'all' || filters.search;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__inner container">
          <div className="header__brand">
            <div className="header__logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div>
              <h1 className="header__title">TaskPilot</h1>
              <p className="header__subtitle">Organize your work with clarity.</p>
            </div>
          </div>
          <button className="btn btn--primary btn--lg" onClick={openCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      <main className="main container">
        {/* Stats */}
        <StatsBar />

        {/* Filters */}
        <FilterBar />

        {/* Task Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner spinner--lg" />
            <p>Loading tasks…</p>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState filtered={isFiltered} onAdd={openCreate} />
        ) : (
          <>
            <div className="tasks-header">
              <p className="tasks-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="task-grid">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} onEdit={openEdit} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm task={editingTask} onClose={closeModal} />
      </Modal>
    </div>
  );
}
