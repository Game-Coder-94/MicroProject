import React, { useState } from 'react';
import '../styles/Grading.css';

function Grading() {
  const [scoresFile, setScoresFile] = useState(null);
  const [creditsFile, setCreditsFile] = useState(null);
  const [results, setResults] = useState([]);
  const [sigpState, setSigpState] = useState('');
  const [error, setError] = useState('');

  const handleScoresChange = (e) => {
    setScoresFile(e.target.files[0]);
    setError('');
    setResults([]);
  };

  const handleCreditsChange = (e) => {
    setCreditsFile(e.target.files[0]);
    setError('');
    setResults([]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!scoresFile) return setError('Please select a Scores file first.');
    if (!creditsFile) return setError('Please select a Credits file first.');

    const formData = new FormData();
    formData.append('csvMarksFile', scoresFile);
    formData.append('csvCreditsFile', creditsFile);
    formData.append('sigp', sigpState);

    try {
      const response = await fetch('http://localhost:8000/grades', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setError('');
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const getGradeClass = (grade) => {
    if (!grade) return 'grade-unknown';
    if (grade === 'A+') return 'grade-A-plus';
    return `grade-${grade.replace('+', 'plus')}`;
  };

  const getCourses = () => {
    if (results.length === 0) return [];
    return Object.keys(results[0].courseGrades || {});
  };

  const courses = getCourses();

  return (
    <div className="grading-app">
      <header className="topbar">Student Course Report</header>

      <div className="main">
        <aside className="sidebar">
          <div className="upload-card">
            <h3>Upload Files</h3>
            <form onSubmit={handleUpload}>
              <label className="file-label">Scores (.csv)</label>
              <input className="file-input" type="file" accept=".csv" onChange={handleScoresChange} />

              <label className="file-label">Credits (.csv)</label>
              <input className="file-input" type="file" accept=".csv" onChange={handleCreditsChange} />

              <label className="file-label">Optional SIGP</label>
              <input className="text-input" type="text" placeholder="SIGP (optional)" value={sigpState} onChange={(e) => setSigpState(e.target.value)} />

              <button className="primary-btn" type="submit" disabled={!scoresFile || !creditsFile}>Calculate Grades</button>
            </form>

            {error && <div className="error">{error}</div>}
            <div className="note">Minimalist black & white theme</div>
          </div>
        </aside>

        <section className="content">
          <div className="content-card">
            {results.length === 0 ? (
              <div className="placeholder">Upload files to see results</div>
            ) : (
              <div className="table-wrap">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Avg Z-Score</th>
                      {courses.map((subject) => (
                        <th key={subject}>{subject}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((student, idx) => (
                      <tr key={idx}>
                        <td className="name-cell">{student.name}</td>
                        <td className="zcell">{student.avgZScore}</td>
                        {courses.map((subject) => (
                          <td key={subject}>
                            <span className={`grade-badge ${getGradeClass(student.courseGrades[subject])}`}>
                              {student.courseGrades[subject]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="footer">copyright Devashish and Team</footer>
    </div>
  );
}

export default Grading;