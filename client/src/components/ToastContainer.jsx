import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Toast = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };


  const getStyle = (type) => {
    switch (type) {
      case "success":
        return { bg: "#28a745", icon: "✓", title: "Successfully Registered!" };
      case "unsubscribe":
        return { bg: "#fd7e14", icon: "⚠", title: "Course Unsubscribed!" };
      case "info":
        return { bg: "#0d6efd", icon: "ℹ", title: "Information" };
      case "error":
        return { bg: "#dc3545", icon: "!", title: "Error" };
      default:
        return { bg: "#6c757d", icon: "🔔", title: "Notification" };
    }
  };

  const style = getStyle(notification.type);

  return (
    <div
      className={`toast-item ${isExiting ? "exiting" : ""}`}
      style={{ backgroundColor: style.bg }}
    >
      <div className="toast-icon">{style.icon}</div>
      <div className="toast-body">
        <div className="toast-title">{style.title}</div>
        <div className="toast-message">{notification.message}</div>
      </div>
    </div>
  );
};


Toast.propTypes = {
  notification: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const ToastContainer = ({ notifications }) => {
  const [visibleToasts, setVisibleToasts] = useState([]);
  // Track IDs that have been dismissed to prevent re-showing
  const dismissedIds = useRef(new Set());

  useEffect(() => {
    // Find notifications that are new (not in visible and not dismissed before)
    const newNotifications = notifications.filter(
      (n) => !visibleToasts.some((vt) => vt.id === n.id) && !dismissedIds.current.has(n.id)
    );

    if (newNotifications.length > 0) {
      setVisibleToasts((prev) => [...prev, ...newNotifications]);
    }
  }, [notifications]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = (id) => {
    // Add to dismissed set so it won't show again
    dismissedIds.current.add(id);
    setVisibleToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <style>
        {`
          .toast-container {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .toast-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            width: 350px;
            max-width: 90vw;
            animation: slideInRight 0.3s ease;
          }
          .toast-item.exiting {
            animation: slideOutRight 0.3s ease forwards;
          }
          .toast-icon {
            font-size: 1.2rem;
            font-weight: bold;
            margin-right: 12px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .toast-body { flex-grow: 1; }
          .toast-title {
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 2px;
          }
          .toast-message { font-size: 0.85rem; }
          .toast-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            line-height: 1;
            opacity: 0.8;
            cursor: pointer;
            padding: 0 0 0 8px;
          }
          .toast-close-btn:hover { opacity: 1; }
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `}
      </style>
      <div className="toast-container">
        {visibleToasts.map((notification) => (
          <Toast key={notification.id} notification={notification} onDismiss={handleDismiss} />
        ))}
      </div>
    </>
  );
};

ToastContainer.propTypes = {
  notifications: PropTypes.array.isRequired,
};


export default ToastContainer;
