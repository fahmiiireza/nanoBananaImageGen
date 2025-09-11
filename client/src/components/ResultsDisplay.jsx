
import React from 'react';

function ResultsDisplay({ results }) {
  const { folderLink } = results;

  if (!folderLink) {
    return null;
  }

  return (
    <div className="results-container">
      <h2>Generation Complete</h2>
      <div className="gdrive-link-container">
        <p>Your images have been uploaded to Google Drive:</p>
        <a href={folderLink} target="_blank" rel="noopener noreferrer" className="gdrive-link">
          {folderLink}
        </a>
      </div>
    </div>
  );
}

export default ResultsDisplay;
