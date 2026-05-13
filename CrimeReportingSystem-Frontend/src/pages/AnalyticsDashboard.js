import React, { useEffect, useState } from 'react';
import analyticsService from '../services/analyticsService';
import styles from '../styles/Analytics.module.css';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const AnalyticsDashboard = () => {
  const [trends, setTrends] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [peakTimes, setPeakTimes] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '' });

  const load = async () => {
    try {
      const f = { from: filters.from, to: filters.to };
      const t = await analyticsService.getCrimeTrends(f);
      const h = await analyticsService.getHotspotData(f);
      const p = await analyticsService.getPerformanceMetrics(f);
      const pt = await analyticsService.getPeakTimes(f);
      setTrends(t.data || []);
      setHotspots(h.data || []);
      setPerformance(p.data || []);
      setPeakTimes(pt.data || []);
    } catch (err) { toast.error('Failed to load analytics'); }
  };

  useEffect(() => { load(); }, []);

  const handleExport = async (format) => {
    try {
      const res = await analyticsService.exportReport(filters, format);
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
      saveAs(blob, `analytics.${format === 'pdf' ? 'pdf' : 'csv'}`);
      toast.success('Export ready');
    } catch (err) { toast.error('Export failed'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2>Analytics Dashboard</h2>
        <div className={styles.controls}><input type="date" value={filters.from} onChange={e => setFilters({...filters, from: e.target.value})} />
        <input type="date" value={filters.to} onChange={e => setFilters({...filters, to: e.target.value})} />
        <button onClick={load}>Apply</button>
        <button onClick={() => handleExport('csv')}>Export CSV</button>
        </div>
      </div>

      <section className={styles.card}><h3>Crime Trends</h3>
        <div className={styles.list}>{trends.map((t,i) => (<div key={i}>{t.date} - {t.crimeType}: {t.count}</div>))}</div>
      </section>

      <section className={styles.card}><h3>Hotspots</h3>
        <div className={styles.list}>{hotspots.map((h,i) => (<div key={i}>{h.location} ({h.count})</div>))}</div>
      </section>

      <section className={styles.card}><h3>Performance</h3>
        <div className={styles.list}>{performance.map((p,i) => (<div key={i}>{p.stationName} - Resolved: {p.resolved} Active: {p.active} AvgRespHours: {p.avgResponseTimeHours}</div>))}</div>
      </section>

      <section className={styles.card}><h3>Peak Times</h3>
        <div className={styles.list}>{peakTimes.map((pt,i) => (<div key={i}>{pt.hourOfDay}:00 - {pt.complaintCount}</div>))}</div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;