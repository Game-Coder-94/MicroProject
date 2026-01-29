import React, { useState } from 'react';
import '../styles/Grading.css';

function Grading() {
  const [scoresFile, setScoresFile] = useState(null);
  const [creditsFile, setCreditsFile] = useState(null);
  const [results, setResults] = useState([]);
  const [sigpState, setSigpState] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setScoresFile(e.target.files[0]);
    setError('');
    setResults([]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!scoresFile) {
      setError("Please select a Scores file first.");
      return;
    }
    if (!creditsFile) {
      setError("Please select a Credits file first.");
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', scoresFile);
    formData.append('creditsFile', creditsFile);
    formData.append('sigp', sigpState);

    try {
      const response = await fetch('http://localhost:8000/grades', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || "Unknown error occurred");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  const getGradeClass = (grade) => {
    // Map symbols to text safe for CSS
    if (grade === 'A+') return 'grade-A-plus';
    return `grade-${grade}`; // Falls back to grade-A, grade-B, etc.
  };

  const getSubjects = () => {
    if (results.length === 0) return [];
    return Object.keys(results[0].subjectGrades);
  };

  const subjects = getSubjects();

  return (
    <div className="container">
      <h1>Student Subject Grader</h1>

      <div className="card">
        <form onSubmit={handleUpload}>
          <div className='input-flex'>
            <div className='input-row'>
              <label>Scores File:</label>
              <input type="file" accept=".csv" onChange={handleFileChange} />
              <label>Credits File:</label>
              <input type="file" accept=".csv" onChange={handleFileChange} />
              <button type="submit" disabled={!scoresFile}>Calculate Grades</button>
            </div>
            
              <div className='input-row'>
                <label>Optional SIGP:</label>
                <input type="text" placeholder="SIGP (optional)" value={sigpState} onChange={(e) => setSigpState(e.target.value)} />
              </div>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {results.length > 0 && (
        <div className="results-area">
          <h2>Detailed Subject Report</h2>
          <table>
            <thead>
              <tr>
                {/* 1. Name */}
                <th>Student Name</th>

                {/* 2. New Column: Avg Z-Score */}
                <th style={{ backgroundColor: '#6c757d' }}>Avg Z-Score</th>
                
                {/* 3. Dynamic Subject Columns */}
                {subjects.map((subject) => (
                  <th key={subject}>{subject}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((student, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 'bold' }}>{student.name}</td>

                  {/* Display the Avg Z-Score */}
                  <td style={{ fontWeight: 'bold', color: '#555' }}>
                    {student.avgZScore}
                  </td>
                  
                  {/* Display Grades for each subject */}
                  {subjects.map((subject) => (
                    <td key={subject}>
                      <span className={`grade-badge ${getGradeClass(student.subjectGrades[subject])}`}>
                        {student.subjectGrades[subject]}
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
  );
}

export default Grading;