import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

export default function UploadPanel({ onUpload }) {
  const [scoresFile, setScoresFile] = useState(null);
  const [creditsFile, setCreditsFile] = useState(null);
  const [sigp, setSigp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!scoresFile || !creditsFile) {
      setError('Please upload both CSV files');
      return;
    }

    const formData = new FormData();
    formData.append('csvMarksFile', scoresFile);
    formData.append('csvCreditsFile', creditsFile);
    if (sigp) {
      formData.append('sigp', sigp);
    }

    console.log('Uploading files:', {
      scoresFile: scoresFile.name,
      creditsFile: creditsFile.name,
      sigp: sigp || 'not provided'
    });

    setLoading(true);
    try {
      await onUpload(formData);
    } catch (err) {
      setError(err.message || 'Failed to calculate grades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-xl shadow-md mb-6 max-w-4xl mx-auto"
      style={{
        backgroundColor: 'var(--gpa-card-bg)',
        border: '1px solid var(--gpa-border)',
      }}
    >
      <h3 className="text-xl mb-4" style={{ color: 'var(--gpa-text)' }}>
        Upload Grade Data
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="scores-file"
              className="block text-sm mb-2"
              style={{ color: 'var(--gpa-text)' }}
            >
              Scores CSV (scores.csv)
            </label>
            <div className="relative">
              <input
                id="scores-file"
                type="file"
                accept=".csv"
                onChange={(e) => setScoresFile(e.target.files[0])}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--gpa-bg)',
                  borderColor: 'var(--gpa-border)',
                  color: 'var(--gpa-text)',
                }}
              />
            </div>
            {scoresFile && (
              <p className="text-xs mt-1" style={{ color: 'var(--gpa-accent)' }}>
                ✓ {scoresFile.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="credits-file"
              className="block text-sm mb-2"
              style={{ color: 'var(--gpa-text)' }}
            >
              Credits CSV (credits.csv)
            </label>
            <input
              id="credits-file"
              type="file"
              accept=".csv"
              onChange={(e) => setCreditsFile(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--gpa-bg)',
                borderColor: 'var(--gpa-border)',
                color: 'var(--gpa-text)',
              }}
            />
            {creditsFile && (
              <p className="text-xs mt-1" style={{ color: 'var(--gpa-accent)' }}>
                ✓ {creditsFile.name}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="sigp"
              className="block text-sm mb-2"
              style={{ color: 'var(--gpa-text)' }}
            >
              SIGP (Optional)
            </label>
            <input
              id="sigp"
              type="number"
              step="0.01"
              value={sigp}
              onChange={(e) => setSigp(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--gpa-bg)',
                borderColor: 'var(--gpa-border)',
                color: 'var(--gpa-text)',
              }}
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? 'var(--gpa-muted)' : 'var(--gpa-accent)',
                color: '#ffffff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Calculate Grades
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="p-3 rounded-lg text-sm"
            style={{
              backgroundColor: '#fee',
              color: '#c33',
              border: '1px solid #fcc',
            }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}