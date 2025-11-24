import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAllRead, onDeleteAll, onDeleteOne }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationStyle = (type) => {
    switch (type) {
      case "success":
        return { bg: "#28a745", icon: "✓", title: "Successfully Registered !" };
      case "unsubscribe":
        return { bg: "#fd7e14", icon: "⚠", title: "Courses Unsubscribed !" };
      default:
        return { bg: "#0d6efd", icon: "ℹ", title: "Notification" };
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          .notification-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 1040;
            opacity: ${isOpen ? 1 : 0};
            transition: opacity 0.3s ease;
          }
          
          .notification-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 380px;
            max-width: 100%;
            height: 100vh;
            background: #fff;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
            z-index: 1050;
            transform: translateX(${isOpen ? "0" : "100%"});
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
          }
          
          .notification-header {
            padding: 16px 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
          }
          
          .notification-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #212529;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .unread-badge {
            background: #0d6efd;
            color: white;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          
          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6c757d;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            transition: color 0.2s;
          }
          
          .close-btn:hover {
            color: #212529;
          }
          
          .notification-actions {
            padding: 12px 20px;
            display: flex;
            gap: 10px;
            border-bottom: 1px solid #e9ecef;
          }
          
          .action-btn {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            background: #fff;
            color: #495057;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s;
          }
          
          .action-btn:hover {
            background: #f8f9fa;
            border-color: #adb5bd;
          }
          
          .notification-list {
            flex: 1;
            overflow-y: auto;
            padding: 0;
          }
          
          .notification-item {
            padding: 16px 20px;
            border-bottom: 1px solid #e9ecef;
            position: relative;
            animation: slideIn 0.3s ease;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .notification-content {
            display: flex;
            gap: 12px;
          }
          
          .notification-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1rem;
            flex-shrink: 0;
          }
          
          .notification-body {
            flex: 1;
            min-width: 0;
          }
          
          .notification-body-title {
            font-weight: 600;
            color: #212529;
            font-size: 0.9rem;
            margin-bottom: 4px;
          }
          
          .notification-body-message {
            color: #6c757d;
            font-size: 0.85rem;
            line-height: 1.4;
            margin-bottom: 6px;
          }
          
          .notification-meta {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .notification-time {
            color: #6c757d;
            font-size: 0.75rem;
          }
          
          .new-badge {
            background: #0d6efd;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
          }
          
          .delete-notification-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            color: #adb5bd;
            cursor: pointer;
            font-size: 1.1rem;
            padding: 4px;
            line-height: 1;
            transition: color 0.2s;
          }
          
          .delete-notification-btn:hover {
            color: #dc3545;
          }
          
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: #6c757d;
          }
          
          .empty-icon {
            font-size: 3rem;
            margin-bottom: 16px;
          }
        `}
      </style>

      <div className="notification-overlay" onClick={onClose} />
      
      <div className="notification-panel">
        <div className="notification-header">
          <h2 className="notification-title">
            Notification
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} Unread</span>
            )}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="notification-actions">
          <button className="action-btn" onClick={onMarkAllRead}>
            ✓ Mark as read
          </button>
          <button className="action-btn" onClick={onDeleteAll}>
            🗑 Delete all notif
          </button>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const style = getNotificationStyle(notification.type);
              return (
                <div key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <div
                      className="notification-icon"
                      style={{ backgroundColor: style.bg }}
                    >
                      {style.icon}
                    </div>
                    <div className="notification-body">
                      <div className="notification-body-title">{style.title}</div>
                      <div className="notification-body-message">
                        {notification.message}
                      </div>
                      <div className="notification-meta">
                        <span className="notification-time">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="new-badge">New</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className="delete-notification-btn"
                    onClick={() => onDeleteOne(notification.id)}
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

NotificationPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(["success", "unsubscribe", "info"]).isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
      read: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onMarkAllRead: PropTypes.func.isRequired,
  onDeleteAll: PropTypes.func.isRequired,
  onDeleteOne: PropTypes.func.isRequired,
};

export default NotificationPanel;