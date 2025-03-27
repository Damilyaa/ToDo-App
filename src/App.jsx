import React, { useEffect, useState } from 'react';

import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Tabs from './components/Tabs/Tabs';
import AddTaskButton from './components/AddTaskButton/AddTaskButton';
import Form from './components/Form/Form';
import TaskList from './components/TaskList/TaskList';
import Auth from './components/Auth/Auth';

import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("To Do");
  const [activeForm, setActiveForm] = useState(false);
  const [formText, setFormText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchTasks();
    } else {
      setIsAuthenticated(false);
      setTasks([]);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setTasks([]);
  };

  const fetchTasks = async () => {
    try {
      if (!token) {
        return; // Don't fetch if there's no token
      }

      const response = await fetch('http://localhost:5001/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      fetchTasks();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      fetchTasks();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleAddTask = async () => {
    if (formText.trim()) {
      try {
        const response = await fetch('http://localhost:5001/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title: formText }),
        });

        if (!response.ok) {
          throw new Error('Failed to add task');
        }

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setFormText("");
        setActiveForm(false);
      } catch (error) {
        console.error('Error adding task:', error);
        setError('Failed to add task');
      }
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const response = await fetch(`http://localhost:5001/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map((task) =>
        task._id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to update task');
    }
  };

  const handleMoveToTrash = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inTrash: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to move task to trash');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map((task) =>
        task._id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error moving task to trash:', error);
      setError('Failed to move task to trash');
    }
  };

  const handleRestoreTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inTrash: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to restore task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map((task) =>
        task._id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error restoring task:', error);
      setError('Failed to restore task');
    }
  };

  const handleDeleteForever = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const onAddTask = () => {
    setActiveForm(!activeForm);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "To Do") {
      return !task.inTrash;
    }
    if (activeTab === "Done") {
      return task.completed && !task.inTrash;
    }
    if (activeTab === "Trash") {
      return task.inTrash;
    }
    return true;
  });

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <div className="container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="wrapper">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <AddTaskButton onAddTask={onAddTask} />
        </div>

        {activeForm && (
          <Form
            formText={formText}
            setFormText={setFormText}
            handleAddTask={handleAddTask}
          />
        )}

        <h1 className="activeTabTitle">{activeTab}</h1>
        <hr className="divider" />
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks here</p>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onMoveToTrash={handleMoveToTrash}
            onMoveBackToTodo={handleRestoreTask}
            onDeleteForever={handleDeleteForever}
            onToggleTask={handleToggleTask}
            activeTab={activeTab}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;