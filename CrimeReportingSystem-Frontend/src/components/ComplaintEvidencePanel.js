import React, { useEffect, useState } from 'react';
import evidenceService from '../services/evidenceService';
import styles from '../styles/Evidence.module.css';
import EvidenceUploadModal from './EvidenceUploadModal';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const ComplaintEvidencePanel = ({ complaintId, currentUserRole }) => {
  const [evidence, setEvidence] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  const load = async () => {
    try {
      const res = await evidenceService.getEvidenceList(complaintId);
      setEvidence(res.data || []);
    } catch (err) { toast.error('Failed to load evidence'); }
  };

  useEffect(() => { if (complaintId) load(); }, [complaintId]);

  const handleDownload = async (id, filename) => {
    try {
      const res = await evidenceService.downloadEvidence(id);
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
      saveAs(blob, filename);
    } catch (err) { toast.error('Download failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await evidenceService.deleteEvidence(id);
      setEvidence((prev) => prev.filter(e => e.id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error('Delete failed'); }
  };

  const onUploaded = (dto) => { setEvidence((p) => [dto, ...p]); setShowUpload(false); };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Evidence</h3>
        <div>
          {(currentUserRole === 'USER' || currentUserRole === 'POLICE') && <button className={styles.primaryBtn} onClick={() => setShowUpload(true)}>Upload</button>}
        </div>
      </div>

      <div className={styles.list}>
        {evidence.length === 0 && <div className={styles.empty}>No files</div>}
        {evidence.map(ev => (
          <div key={ev.id} className={styles.item}>
            <div className={styles.meta}>
              <div className={styles.filename}>{ev.filename}</div>
              <div className={styles.sub}>{ev.fileType} • uploaded by {ev.uploadedBy} • {new Date(ev.uploadedAt).toLocaleString()}</div>
              {ev.description && <div className={styles.description}>{ev.description}</div>}
            </div>
            <div className={styles.actions}>
              <button className={styles.smallBtn} onClick={() => handleDownload(ev.id, ev.filename)}>Download</button>
              {(currentUserRole === 'POLICE' || currentUserRole === 'ADMIN') && <button className={styles.smallBtn} onClick={() => handleDelete(ev.id)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>

      {showUpload && <EvidenceUploadModal complaintId={complaintId} onClose={() => setShowUpload(false)} onUploaded={onUploaded} />}
    </div>
  );
};

export default ComplaintEvidencePanel;
