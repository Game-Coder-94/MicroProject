import React, { useState } from 'react';
import SemesterHeader from './SemesterHeader';
import GPAOverview from './GPAOverview';
import SemesterOverview from './SemesterOverview';
import ClassesTable from './ClassesTable';
import ClassByWeightChart from './ClassByWeightChart';
import GradeOverviewChart from './GradeOverviewChart';
import NormalCurveChart from './NormalCurveChart';
import UploadPanel from './UploadPanel';
import { postGrades } from './api';
import { mapResultsToAggregates } from '../utils/dataMappers';

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await postGrades(formData);
      
      if (data.success && data.results) {
        setResults(data.results);
        const agg = mapResultsToAggregates(data.results);
        setAggregates(agg);
      } else {
        throw new Error(data.message || 'Failed to process grades');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    setResults([]);
    setAggregates(null);
    setError(null);
    console.log('Dashboard data cleared');
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: 'var(--gpa-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        <UploadPanel onUpload={handleUpload} />

        {error && (
          <div
            className="mb-6 p-4 rounded-xl shadow-md"
            style={{
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              color: '#c33',
            }}
          >
            <strong>Error:</strong> {error}
            <p className="text-sm mt-1">
              Make sure the backend server is running at http://localhost:8000
            </p>
          </div>
        )}

        {isLoading && (
          <div
            className="p-12 rounded-xl shadow-md text-center"
            style={{
              backgroundColor: 'var(--gpa-card-bg)',
              border: '1px solid var(--gpa-border)',
            }}
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <h3 className="text-xl mb-2" style={{ color: 'var(--gpa-text)' }}>
                Processing Data...
              </h3>
              <p className="text-sm" style={{ color: 'var(--gpa-text)', opacity: 0.7 }}>
                Calculating grades and generating dashboard
              </p>
            </div>
          </div>
        )}

        {!aggregates && !isLoading ? (
          <div
            className="p-12 rounded-xl shadow-md text-center"
            style={{
              backgroundColor: 'var(--gpa-card-bg)',
              border: '1px solid var(--gpa-border)',
            }}
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl mb-2" style={{ color: 'var(--gpa-text)' }}>
                Ready to Calculate Grades
              </h3>
              <p className="text-sm" style={{ color: 'var(--gpa-text)', opacity: 0.7 }}>
                Upload your scores and credits CSV files above to get started. The dashboard will
                display class-level aggregates, GPA calculations, and grade distributions.
              </p>
              <div className="mt-6 text-left space-y-2" style={{ color: 'var(--gpa-text)', opacity: 0.6 }}>
                <p className="text-xs">
                  <strong>scores.csv</strong> — Student names and course scores
                </p>
                <p className="text-xs">
                  <strong>credits.csv</strong> — Course credit hours
                </p>
                <p className="text-xs">
                  <strong>SIGP</strong> — Optional grade point adjustment
                </p>
              </div>
            </div>
          </div>
        ) : aggregates && !isLoading ? (
          <div className="space-y-6">
            {/* Success message */}
            <div
              className="p-4 rounded-xl shadow-md flex items-center justify-between"
              style={{
                backgroundColor: 'var(--gpa-accent-2)',
                border: '1px solid var(--gpa-border)',
              }}
            >
              <p className="text-sm" style={{ color: 'var(--gpa-text)' }}>
                ✓ Successfully loaded data for <strong>{results.length} student{results.length !== 1 ? 's' : ''}</strong>
              </p>
              <button
                onClick={handleClearData}
                className="px-4 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'var(--gpa-muted)',
                  color: 'var(--gpa-text)',
                  border: '1px solid var(--gpa-border)',
                }}
              >
                Clear Data
              </button>
            </div>

            {/* Top Row: Semester Header + GPA Overview + Semester Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              
              <GPAOverview data={aggregates.classSummary} />
              <SemesterOverview data={aggregates.semesterOverview} />
            </div>

            {/* Main Content Area: Classes Table + Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <ClassesTable courses={aggregates.courses} results={results} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClassByWeightChart data={aggregates.classByWeight} />
              <GradeOverviewChart data={aggregates.gradeDistribution} />
            </div>

            {/* Bell curve chart */}
            <div className="mt-6">
              <NormalCurveChart data={aggregates.normalCurveData} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
