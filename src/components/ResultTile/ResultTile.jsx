import React from 'react';
import { Tile, Tag } from '@carbon/react';
import './ResultTile.scss';

function ResultTile({ match, getCategoryColor, getSimilarityColorClass }) {
  return (
    <Tile className={`result-tile ${getSimilarityColorClass(match.similarity_score || 0)}`}>
      <div className="result-header">
        <h4 className="result-subject">{match.subject || 'No Subject'}</h4>
        <span className={`accuracy-badge ${getSimilarityColorClass(match.similarity_score || 0)}`}>
          Accuracy {((match.similarity_score || 0) * 100).toFixed(0)}%
        </span>
      </div>
      <a
        href={`https://ibm-middleware.atlassian.net/browse/${match.ticket}`}
        target="_blank"
        rel="noopener noreferrer"
        className="result-ticket-link"
      >
        Ticket: {match.ticket}
      </a>
      {match.category && (
        <div className="result-category-container">
          <Tag type={getCategoryColor(match.category)} size="sm" className="result-category-tag">
            {match.category}
          </Tag>
        </div>
      )}
      
      <div className="result-divider"></div>
      <div className="result-section">
        <span className="sub-heading">Description</span>
        <p className="result-text">{match.description || 'No description available'}</p>
      </div>
      <div className="result-section">
        <span className="sub-heading">Resolution</span>
        <p className="result-text">{match.resolution || 'No resolution available'}</p>
      </div>
    </Tile>
  );
}

export default ResultTile;

