import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Notifications = ({ notifications, onClear }) => {
  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="notifications-container">
      {notifications.slice(0, 3).map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type || 'info'}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {getIcon(notification.type)}
            </div>
            <div className="notification-text">
              <div className="notification-title">{notification.title}</div>
              {notification.message && (
                <div className="notification-message">{notification.message}</div>
              )}
            </div>
          </div>
          <button
            onClick={() => onClear(notification.id)}
            className="notification-close"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;