import React, { useState } from 'react';
import evidenceService from '../services/evidenceService';
import styles from '../styles/Evidence.module.css';
import { toast } from 'react-toastify';

const EvidenceUploadModal = ({ complaintId, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.warning('Select a file');
    setUploading(true);
    try {
      const res = await evidenceService.uploadEvidence(complaintId, file, description, (ev) => {
        if (ev.total) setProgress(Math.round((ev.loaded * 100) / ev.total));
      });
      onUploaded && onUploaded(res.data);
      toast.success('Uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}><h3>Upload Evidence</h3><button className={styles.closeBtn} onClick={onClose}>✕</button></div>
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>File</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className={styles.field}>
              <label>Description (optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}></textarea>
            </div>
            {uploading && <div className={styles.progress}><div style={{width: progress + '%'}} className={styles.progressBar}></div></div>}
            <div className={styles.footer}>
              <button className={styles.secondaryBtn} onClick={onClose} type="button">Cancel</button>
              <button className={styles.primaryBtn} type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvidenceUploadModal;
