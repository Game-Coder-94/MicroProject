import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setResults([]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('http://localhost:8000/calculate', {
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
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button type="submit" disabled={!file}>Calculate Grades</button>
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
                      <span className={`grade-badge grade-${student.subjectGrades[subject]}`}>
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

export default App;