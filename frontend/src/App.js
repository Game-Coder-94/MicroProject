import React, { useState } from 'react';
import './App.css'; // We'll add simple styles below

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setResults([]);
  };

  // 2. Handle Upload to Backend
  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Prevent no file selection
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

  return (
    <div className="container">
      <h1><b>Relative Grading Calculator:</b></h1>

      {/* Input Section */}
      <div className="card">
        <form onSubmit={handleUpload}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button type="submit" disabled={!file}>Calculate Grades</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div className="results-area">
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Avg Z-Score</th>
                <th>Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.finalZ}</td>
                  <td>
                    <span className={`grade-badge grade-${student.finalGrade}`}>
                      {student.finalGrade}
                    </span>
                  </td>
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