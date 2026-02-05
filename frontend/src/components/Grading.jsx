import React, { useState } from 'react';
import Header from './Header.jsx';
import '../styles/Grading.css';
import Sidebar from './Sidebar.jsx';

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
      <Header />

      <div className="main">
        <Sidebar
          scoresFile={scoresFile}
          creditsFile={creditsFile}
          onScoresChange={handleScoresChange}
          onCreditsChange={handleCreditsChange}
          sigp={sigpState}
          setSigp={setSigpState}
          onUpload={handleUpload}
          error={error}
        />

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
                      <th>SGPA</th>
                      {courses.map((subject) => (
                        <th key={subject}>{subject}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((student, idx) => (
                      <tr key={idx}>
                        <td className="name-cell">{student.name}</td>
                        <td className="zcell">{student.summary?.sgpa ?? '-'}</td>
                        {courses.map((subject) => (
                          <td key={subject}>
                            <span className={`grade-badge ${getGradeClass(student.courseGrades?.[subject])}`}>
                              {student.courseGrades?.[subject] ?? '-'}
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

      <footer className="footer">copyright Team 8</footer>
    </div>
  );
}

export default Grading;