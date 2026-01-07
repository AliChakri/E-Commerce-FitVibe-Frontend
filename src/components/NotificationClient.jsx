import React, { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { Bell, X, Wifi, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const NotificationClient = ({ userId }) => {

  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const mountedRef = useRef(true);

  // Clean userId - handle different formats
  const cleanUserId = React.useMemo(() => {
    if (!userId) return null;
    
    if (typeof userId === 'string') return userId;
    if (typeof userId === 'object' && userId._id) return userId._id;
    if (typeof userId === 'object' && userId.id) return userId.id;
    
    return null;
  }, [userId]);

  // Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // API helper function
  const apiCall = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }, []);

  // Initialize socket connection
  const SOCKET_URL = import.meta.env.VITE_API_URL;
  const initializeSocket = useCallback(() => {
    if (!cleanUserId) return;

    // Disconnect existing socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on("connect", () => {
      // console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      setError(null);
      
      // Join user room
      socket.emit("joinRoom", cleanUserId);
      // console.log("🏠 Joined room for user:", cleanUserId);
    });

    socket.on("disconnect", (reason) => {
      // console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      // console.error("❌ Socket connection error:", error);
      setIsConnected(false);
      setError("Connection failed");
    });

    // Listen for new notifications
    socket.on("new-notification", (data) => {
      // console.log("🔔 New notification received:", data);
      if (mountedRef.current) {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return socket;
  }, [cleanUserId, SOCKET_URL]);

  // Fetch existing notifications
  const fetchNotifications = useCallback(async () => {
    if (!cleanUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // console.log("📡 Fetching notifications for userId:", cleanUserId);
      
      const data = await apiCall(`${SOCKET_URL}/api/notification/user/${cleanUserId}`);
      
      // console.log("✅ Notifications fetched:", data);
      
      if (mountedRef.current) {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
      
      if (mountedRef.current) {
        setError(err.message || "Failed to fetch notifications");
        setNotifications([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [cleanUserId, SOCKET_URL,apiCall]);

  // Initialize everything when userId changes
  useEffect(() => {
    mountedRef.current = true;
    
    if (!cleanUserId) {
      console.warn("⚠️ No valid userId provided");
      setNotifications([]);
      setLoading(false);
      return;
    }

    // console.log("🚀 Initializing notifications for user:", cleanUserId);
    
    // Initialize socket and fetch notifications
    const socket = initializeSocket();
    fetchNotifications();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [cleanUserId, SOCKET_URL,initializeSocket, fetchNotifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Mark notifications as read
  const markNotificationsAsRead = useCallback(async (notificationsToMark) => {
    if (!notificationsToMark.length) return;

    try {
      await Promise.all(
        notificationsToMark.map((n) =>
          apiCall(`${SOCKET_URL}/api/notification/${n._id}/read`, {
            method: 'PATCH'
          })
        )
      );

      if (mountedRef.current) {
        setNotifications((prevNotes) =>
          prevNotes.map((n) => 
            notificationsToMark.find(unread => unread._id === n._id)
              ? { ...n, isRead: true }
              : n
          )
        );
      }
    } catch (err) {
      console.error("❌ Error marking notifications as read:", err);
    }
  }, [SOCKET_URL, apiCall]);

  // Toggle notification dropdown
  const handleToggle = useCallback(() => {
    setOpenNotification((prev) => {
      const willOpen = !prev;

      if (willOpen) {
        const unreadNotifications = notifications.filter((n) => !n.isRead);
        if (unreadNotifications.length > 0) {
          markNotificationsAsRead(unreadNotifications);
        }
      }

      return willOpen;
    });
  }, [notifications, SOCKET_URL,markNotificationsAsRead]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openNotification && !event.target.closest('.notification-dropdown')) {
        setOpenNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [SOCKET_URL, openNotification]);

  if (!cleanUserId) {
    return (
      <div className="p-2 text-sm text-red-500">
        {t("noValidUserIdProvided")}
      </div>
    );
  }

  return (
    <div className="relative notification-dropdown">
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        title={`${unreadCount} unread notifications`}
      >
        <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5  ltr:-right-0.5 rtl:-left-4 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Connection status indicator */}
        {/* <div className="absolute -bottom-1 ltr:-right-1 rtl:-left-1 ">
          {isConnected ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
        </div> */}
      </button>

      {/* Dropdown */}
      {openNotification && (
        <div className="absolute ltr:right-0 rtl:left-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg z-50 border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200">
              <Bell className="w-4 h-4" /> 
              {t("notifications")}
              {!isConnected && (
                <span className="text-xs text-red-500 font-normal">({t("offline")})</span>
              )}
            </h2>
            <button
              onClick={() => setOpenNotification(false)}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-slate-500">{t("loading")}</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-500 text-sm mb-2">⚠️ {error}</p>
                <button
                  onClick={() => fetchNotifications()}
                  className="text-blue-500 text-sm hover:underline"
                >
                  {t("tryAgain")}
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                  {t("noNotificationsYet")}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-3 mb-2 rounded-lg border transition-colors hover:shadow-sm cursor-pointer ${
                      n.isRead
                        ? "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {n.title}
                      </h4>

                      <div className="flex items-center gap-1 ml-2">
                        {!n.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}

                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 whitespace-nowrap">
                          {n.type}
                        </span>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await apiCall(`${SOCKET_URL}/api/notification/${n._id}`, {
                                method: "DELETE",
                              });

                              setNotifications((prev) =>
                                prev.filter((item) => item._id !== n._id)
                              );
                            } catch (err) {
                              console.error("Delete failed:", err);
                            }
                          }}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          <X className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                      {n.message}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                      {n.scope === 'global' && (
                        <span className="text-blue-500 text-xs">{t("global")}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Debug Panel (Remove in production) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-slate-200 dark:border-slate-700 p-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900">
              <div>{t("user")}: {cleanUserId}</div>
              <div>{t("connected")}: {isConnected ? '' : ''}</div>
              <div>{t("total")}: {notifications.length} | {t("unread")}: {unreadCount}</div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default NotificationClient;