"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Notification = {
  id: number;
  title: string;
  message: string;
  icon: string;
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        id: Date.now(),
        title: 'New Message',
        message: 'Thanks for visiting my portfolio!',
        icon: '👋'
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="absolute top-16 left-0 w-full flex flex-col items-center gap-2.5 z-[1000] pointer-events-none">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl w-[90%] max-w-[350px] flex items-center gap-3 shadow-lg text-black pointer-events-auto"
          >
            <div className="text-xl">{n.icon}</div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{n.title}</span>
              <span className="text-xs opacity-80">{n.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
