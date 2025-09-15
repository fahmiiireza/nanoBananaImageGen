
import React, { useState } from 'react';
import './App.css';
import ScriptForm from './components/ScriptForm';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import { generateSegments } from './api/client';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (formData) => {
    console.log('Form submitted with:', formData);
    setLoading(true);
    setError(null);
    setResults(null);
    setSuccessInfo(null);
    
    try {
      const response = await generateSegments(formData);
      console.log('Generation successful:', response);
      setSuccessInfo(response);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>Nano Banana Image Generator</h1>
          <p>From prompt to picture-perfect. AI-powered image generation for marketers.</p>
        </header>

        <main className="App-main">
          <ScriptForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div className="error-message">Error: {error}</div>
          )}
          {successInfo && (
            <div className="success-message">
              <p>Your image is currently being generated. Once done, you can see it in the folder: {successInfo.folderName}</p>
              <p>Click <a href={successInfo.linkToFolder} target="_blank" rel="noopener noreferrer">here</a> to view the folder.</p>
            </div>
          )}
          {results && (
            <ResultsDisplay results={results} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
