import React, { useState, useEffect } from 'react';
import { Users, Shield, Activity, Database, Download } from 'lucide-react';
import { getAllUsers, getUserActivityLogs, exportSystemData } from '../data/sampleData';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAppointments: 0,
    totalVitals: 0
  });

  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    
    const logs = getUserActivityLogs();
    setActivityLogs(logs);

    // Calculate system stats
    setSystemStats({
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.status === 'active').length,
      totalAppointments: 150, // Mock data
      totalVitals: 1250 // Mock data
    });
  }, []);

  const handleUserStatusToggle = (userId) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
        : u
    ));
  };

  const handleDataExport = () => {
    const data = exportSystemData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulsepoint-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className={`admin-stat-card admin-stat-${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="admin-panel-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Admin Panel</h1>
          <button
            onClick={handleDataExport}
            className="btn btn-primary"
          >
            <Download size={20} />
            Export Data
          </button>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 grid-md-2 grid-lg-4 mb-8">
          <StatCard
            title="Total Users"
            value={systemStats.totalUsers}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="Active Users"
            value={systemStats.activeUsers}
            icon={Activity}
            color="success"
          />
          <StatCard
            title="Total Appointments"
            value={systemStats.totalAppointments}
            icon={Shield}
            color="secondary"
          />
          <StatCard
            title="Vitals Recorded"
            value={systemStats.totalVitals}
            icon={Database}
            color="accent"
          />
        </div>

        <div className="grid grid-cols-1 grid-lg-2 gap-8">
          {/* User Management */}
          <div className="card">
            <h3 className="card-title">User Management</h3>
            <div className="users-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${user.status || 'active'}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUserStatusToggle(user.id)}
                          className={`btn btn-sm ${
                            user.status === 'active' ? 'btn-outline' : 'btn-secondary'
                          }`}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="card">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-logs">
              {activityLogs.slice(0, 10).map((log, index) => (
                <div key={index} className="activity-log-item">
                  <div className="log-content">
                    <div className="log-action">{log.action}</div>
                    <div className="log-details">{log.details}</div>
                  </div>
                  <div className="log-timestamp">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;