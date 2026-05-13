import React, { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';
import styles from '../styles/Notifications.module.css';
import { toast } from 'react-toastify';

const NotificationItem = ({ n, onMark, onDelete, onOpen }) => {
  return (
    <div className={`${styles.item} ${n.read ? styles.read : styles.unread}`} onClick={() => onOpen(n)}>
      <div className={styles.left}>
        <div className={styles.subject}>{n.subject}</div>
        <div className={styles.message}>{n.message}</div>
      </div>
      <div className={styles.actions}>
        {!n.read && <button className={styles.smallBtn} onClick={(e) => { e.stopPropagation(); onMark(n.id); }}>Mark read</button>}
        <button className={styles.smallBtn} onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}>Delete</button>
      </div>
    </div>
  );
};

const NotificationsPanel = ({ onOpenComplaint }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    try {
      const res = await notificationService.getNotifications(0, 50);
      setNotifications(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    load();
    const evt = notificationService.listenForRealtimeNotifications((data) => {
      toast.info('New notification');
      setNotifications((prev) => [data, ...prev]);
    });
    return () => { if (evt) evt.close(); };
  }, []);

  const handleMark = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map(p => p.id === id ? { ...p, read: true } : p));
    } catch (err) { toast.error('Unable to mark read'); }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter(p => p.id !== id));
    } catch (err) { toast.error('Unable to delete'); }
  };

  const filtered = notifications.filter(n => filter === 'all' ? true : (filter === 'unread' ? !n.read : true));

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Notifications</h3>
        <div className={styles.controls}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
          <button className={styles.smallBtn} onClick={() => { notificationService.markAllAsRead().then(load); }}>Mark all read</button>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && <div className={styles.empty}>No notifications</div>}
        {filtered.map(n => (
          <NotificationItem key={n.id} n={n} onMark={handleMark} onDelete={handleDelete} onOpen={(notif) => onOpenComplaint && onOpenComplaint(notif.complaintId)} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
