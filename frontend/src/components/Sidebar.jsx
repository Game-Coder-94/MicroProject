import React from 'react';
import FileUpload from './FileUpload.jsx';

function Sidebar({ scoresFile, creditsFile, onScoresChange, onCreditsChange, sigp, setSigp, onUpload, error }) {
  return (
    <aside className="sidebar">
      <div className="upload-card">
        <h3>Upload Files</h3>
        <form className="file-upload-form" onSubmit={onUpload}>
          <label className="file-label">Scores (.csv)</label>
          <FileUpload handleChange={onScoresChange} id="scores-file" name="csvMarksFile" />
          {scoresFile && <div className="selected-file">{scoresFile.name}</div>}

          <label className="file-label">Credits (.csv)</label>
          <FileUpload handleChange={onCreditsChange} id="credits-file" name="csvCreditsFile" />
          {creditsFile && <div className="selected-file">{creditsFile.name}</div>}

          <label className="file-label">Optional SIGP</label>
          <input className="text-input" type="text" placeholder="SIGP (optional)" value={sigp} onChange={(e) => setSigp(e.target.value)} />

          <button className="primary-btn" type="submit" disabled={!scoresFile || !creditsFile}>Calculate Grades</button>
        </form>

        {error && <div className="error">{error}</div>}
        <div className="note">Minimalist black & white theme</div>
      </div>
    </aside>
  );
}

export default Sidebar;