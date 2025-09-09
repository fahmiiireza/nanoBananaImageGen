
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

  const handleSubmit = async (formData) => {
    console.log('Form submitted with:', formData);
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await generateSegments(formData);
      console.log('Generation successful:', response);
      setResults(response);
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
          <h1>Image Prompt Generator</h1>
          <p>Generate JSON prompts and images with OpenRouter</p>
        </header>

        <main className="App-main">
          <ScriptForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div className="error-message">Error: {error}</div>
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
