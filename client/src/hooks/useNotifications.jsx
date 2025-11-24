import { useState, useCallback } from "react";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addNotification = useCallback((type, courseName) => {
    const newNotification = {
      id: Date.now(),
      type,
      message:
        type === "success"
          ? `You have successfully enroll in ${courseName}. Learn now !`
          : `You have unsubscribed course ${courseName}.`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    // setIsOpen(true); // We will show toasts instead of opening the panel
  }, []);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const deleteOne = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    isOpen,
    unreadCount,
    addNotification,
    openPanel,
    closePanel,
    markAllRead,
    deleteAll,
    deleteOne,
  };
};

export default useNotifications;
