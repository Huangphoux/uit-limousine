import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const shownToastIds = useRef(new Set()); // Track which notifications have shown toasts

  // Debug: log whenever notifications state changes
  useEffect(() => {
    console.log("[useNotifications] notifications state updated:", notifications);
    console.log("[useNotifications] notifications count:", notifications.length);
  }, [notifications]);

  // Fetch notifications from server
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      console.log("[useNotifications] token present:", !!token);
      console.log(
        "[useNotifications] token snippet:",
        token ? token.slice(0, 12) + "..." : "no-token"
      );

      const resp = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("[useNotifications] fetch /notifications status:", resp.status);
      const data = await resp.json();
      console.log("[useNotifications] fetch /notifications response:", data);

      // If not ok, bail out
      if (!resp.ok) {
        console.warn("[useNotifications] notifications fetch failed:", data);
        return;
      }

      // Support both { data: [...] } and direct array
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      console.log("[useNotifications] list extracted from response:", list);
      console.log("[useNotifications] list length:", list.length);

      const mappedNotifications = (list || []).map((n) => ({
        ...n,
        timestamp: new Date(n.createdAt),
        read: !!n.read,
        message: n.body || n.message || n.title || "",
      }));
      console.log("[useNotifications] mapped notifications:", mappedNotifications);
      console.log("[useNotifications] mapped notifications length:", mappedNotifications.length);

      setNotifications(mappedNotifications);

      // Show toast for URGENT notifications that are unread (only once per notification)
      console.log("[useNotifications] Checking for URGENT notifications...");
      mappedNotifications.forEach((n) => {
        console.log("[useNotifications] Notification:", {
          id: n.id,
          type: n.type,
          read: n.read,
          title: n.title,
          isUrgent: n.type === "URGENT",
          isUnread: !n.read,
          shouldShowToast: n.type === "URGENT" && !n.read,
          alreadyShown: shownToastIds.current.has(n.id),
        });

        if (n.type === "URGENT" && !n.read && !shownToastIds.current.has(n.id)) {
          console.log("[useNotifications] Showing URGENT toast for:", n.title);
          shownToastIds.current.add(n.id); // Mark as shown
          toast.error(n.title, {
            description: n.body,
            duration: 8000,
            important: true,
          });
        }
      });

      // Also fetch unread count to validate server-side count endpoint
      try {
        const countResp = await fetch(`${API_URL}/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (countResp.ok) {
          const countData = await countResp.json();
          console.log("[useNotifications] unread-count response:", countData);
        } else {
          console.warn("[useNotifications] unread-count failed, status:", countResp.status);
        }
      } catch (e) {
        console.warn("[useNotifications] unread-count error:", e.message);
      }
    } catch (e) {
      console.warn("Failed to fetch notifications:", e.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleFocus = () => fetchNotifications();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const addNotification = useCallback(async (type, courseName) => {
    // Local fallback notification
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
  }, []);

  const openPanel = useCallback(async () => {
    setIsOpen(true);
    // Mark all as read on open
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const resp = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (e) {
      console.warn("Failed to mark notifications read:", e.message);
    }
  }, []);

  const closePanel = useCallback(() => setIsOpen(false), []);

  const markAllRead = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const resp = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (e) {
      console.warn("Failed to mark all read:", e.message);
    }
  }, []);

  const deleteAll = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      // There is no bulk delete endpoint; delete one by one for now
      await Promise.all(
        notifications.map((n) =>
          fetch(`${API_URL}/notifications/${n.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setNotifications([]);
    } catch (e) {
      console.warn("Failed to delete all notifications:", e.message);
    }
  }, [notifications]);

  const deleteOne = useCallback(async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const resp = await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (e) {
      console.warn("Failed to delete notification:", e.message);
    }
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
    fetchNotifications,
  };
};

export default useNotifications;
