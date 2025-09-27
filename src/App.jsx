import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Vitals from './pages/Vitals';
import Medications from './pages/Medications';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Reports from './pages/Reports';
import DoctorPanel from './pages/DoctorPanel';
import AdminPanel from './pages/AdminPanel';
import Payments from './pages/Payments';
import Notifications from './components/Notifications';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('pulsepoint_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('pulsepoint_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('pulsepoint_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pulsepoint_user');
    localStorage.removeItem('pulsepoint_notifications');
    setNotifications([]);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...notification
    };
    const updatedNotifications = [newNotification, ...notifications.slice(0, 9)];
    setNotifications(updatedNotifications);
    localStorage.setItem('pulsepoint_notifications', JSON.stringify(updatedNotifications));
  };

  const clearNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('pulsepoint_notifications', JSON.stringify(updatedNotifications));
  };

  if (!user) {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <Notifications 
          notifications={notifications} 
          onClear={clearNotification} 
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} addNotification={addNotification} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/vitals" element={<Vitals user={user} addNotification={addNotification} />} />
            <Route path="/medications" element={<Medications user={user} addNotification={addNotification} />} />
            <Route path="/appointments" element={<Appointments user={user} addNotification={addNotification} />} />
            <Route path="/records" element={<MedicalRecords user={user} />} />
            <Route path="/reports" element={<Reports user={user} />} />
            {user.role === 'doctor' && (
              <Route path="/doctor" element={<DoctorPanel user={user} addNotification={addNotification} />} />
            )}
            {user.role === 'admin' && (
              <Route path="/admin" element={<AdminPanel user={user} />} />
            )}
            <Route path="/payments" element={<Payments user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;