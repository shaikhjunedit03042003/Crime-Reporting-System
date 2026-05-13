import React, { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';
import styles from '../styles/Notifications.module.css';

const NotificationBadge = ({ pollInterval = 15000, onClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        if (mounted) setCount(res.data || 0);
      } catch (err) {
        // ignore
      }
    };
    load();
    const id = setInterval(load, pollInterval);

    // SSE for live updates
    const evt = notificationService.listenForRealtimeNotifications((data) => {
      if (data) setCount((c) => c + 1);
    });

    return () => { mounted = false; clearInterval(id); if (evt) evt.close(); };
  }, [pollInterval]);

  return (
    <div className={styles.badgeWrapper} onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" fill="#374151"/>
        <path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#374151"/>
      </svg>
      {count > 0 && <span className={styles.count}>{count}</span>}
    </div>
  );
};

export default NotificationBadge;
