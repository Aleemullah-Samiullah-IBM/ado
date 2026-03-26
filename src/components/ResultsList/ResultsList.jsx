import React from 'react';
import { Grid, Column, InlineNotification } from '@carbon/react';
import ResultTile from '../ResultTile/ResultTile';
import AccuracyFilter from '../AccuracyFilter/AccuracyFilter';
import LLMResolutionTile from '../LLMResolutionTile/LLMResolutionTile';
import './ResultsList.scss';

function ResultsList({
  results,
  minAccuracy,
  maxAccuracy,
  setMinAccuracy,
  setMaxAccuracy,
  getCategoryColor,
  getSimilarityColorClass
}) {
  if (!results) return null;

  const historyMatches = results?.data?.history_match || [];

  if (historyMatches.length === 0) {
    return (
      <div className="results-container">
        <InlineNotification
          kind="info"
          title="No Results"
          subtitle="No history matches found for your query."
          hideCloseButton
        />
      </div>
    );
  }

  // Sort by similarity_score in descending order
  const sortedMatches = [...historyMatches].sort((a, b) => {
    const scoreA = a.similarity_score || 0;
    const scoreB = b.similarity_score || 0;
    return scoreB - scoreA;
  });

  // Filter by accuracy range
  const filteredMatches = sortedMatches.filter((match) => {
    const accuracyPercent = (match.similarity_score || 0) * 100;
    return accuracyPercent >= minAccuracy && accuracyPercent <= maxAccuracy;
  });

  return (
    <div className="results-container">
      <AccuracyFilter
        minAccuracy={minAccuracy}
        maxAccuracy={maxAccuracy}
        setMinAccuracy={setMinAccuracy}
        setMaxAccuracy={setMaxAccuracy}
        filteredCount={filteredMatches.length}
        totalCount={sortedMatches.length}
      />

      {/* Display Predicted Category */}
      {results?.data?.category && (
        <Grid className="predicted-category-grid">
          <Column lg={16} md={8} sm={4}>
            <div className="predicted-category-section">
              <h3 className="predicted-category-title">
                Predicted Category - <span className="predicted-category-value">{results.data.category}</span>
              </h3>
            </div>
          </Column>
        </Grid>
      )}
      
      {filteredMatches.length === 0 ? (
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="info"
              title="No Results in Range"
              subtitle={`No results found with accuracy between ${minAccuracy}% and ${maxAccuracy}%. Try adjusting the accuracy range.`}
              hideCloseButton
            />
          </Column>
        </Grid>
      ) : (
        <Grid>
          {filteredMatches.map((match, index) => (
            <Column key={index} lg={16} md={8} sm={4}>
              <ResultTile
                match={match}
                getCategoryColor={getCategoryColor}
                getSimilarityColorClass={getSimilarityColorClass}
              />
            </Column>
          ))}
        </Grid>
      )}

      <LLMResolutionTile llmResolution={results?.data?.llm_resolution} />
    </div>
  );
}

export default ResultsList;

