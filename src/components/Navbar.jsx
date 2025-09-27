import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  Heart, 
  Home,
  Activity,
  Pill,
  Calendar,
  FileText,
  BarChart3,
  Stethoscope,
  Shield,
  CreditCard
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Dashboard', icon: Home },
      { path: '/vitals', label: 'Vitals', icon: Activity },
      { path: '/medications', label: 'Medications', icon: Pill },
      { path: '/appointments', label: 'Appointments', icon: Calendar },
      { path: '/records', label: 'Records', icon: FileText },
      { path: '/reports', label: 'Reports', icon: BarChart3 },
      { path: '/payments', label: 'Payments', icon: CreditCard },
    ];

    if (user.role === 'doctor') {
      commonItems.push({ path: '/doctor', label: 'Doctor Panel', icon: Stethoscope });
    }

    if (user.role === 'admin') {
      commonItems.push({ path: '/admin', label: 'Admin Panel', icon: Shield });
    }

    return commonItems;
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Top Header */}
      <header className="top-header">
        <div className="header-container">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          
          <div className="header-brand">
            <Heart className="brand-icon" size={24} />
            <span className="brand-text">PulsePoint</span>
          </div>

          <div className="header-user">
            <Link to="/profile" className="user-profile-link">
              <User size={20} />
              <span className="user-name">{user.name}</span>
            </Link>
            <button onClick={onLogout} className="logout-btn">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Heart className="sidebar-brand-icon" size={28} />
            <span className="sidebar-brand-text">PulsePoint</span>
          </div>
          <button
            className="sidebar-close"
            onClick={closeSidebar}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
                    onClick={closeSidebar}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;