import React from 'react';
import { Grid, Column, InlineNotification, Tag, Accordion, AccordionItem, Button } from '@carbon/react';
import { Download } from '@carbon/icons-react';
import ResultTile from '../ResultTile/ResultTile';
import LLMResolutionTile from '../LLMResolutionTile/LLMResolutionTile';
import './BatchResultsList.scss';

function BatchResultsList({
  batchResults,
  getCategoryColor,
  getSimilarityColorClass
}) {
  if (!batchResults) return null;

  // Handle the new batch response structure
  const batchData = batchResults?.data?.results || [];
  const processedCount = batchResults?.data?.processed || 0;
  const errorCount = batchResults?.data?.errors || 0;
  
  if (batchData.length === 0) {
    return (
      <div className="results-container">
        <InlineNotification
          kind="info"
          title="No Results"
          subtitle="No batch results found."
          hideCloseButton
        />
      </div>
    );
  }

  const handleExportResults = () => {
    // Prepare CSV data
    const csvRows = [];
    
    // Add header row
    csvRows.push([
      'Query',
      'Query Category',
      'LLM Resolution',
      'Match Ticket',
      'Match Subject',
      'Match Category',
      'Similarity Score',
      'Match Description',
      'Match Resolution'
    ].join(','));

    // Add data rows
    batchData.forEach((queryResult) => {
      const historyMatches = queryResult?.history_match || [];
      const query = `"${(queryResult.query || 'N/A').replace(/"/g, '""')}"`;
      const queryCategory = `"${(queryResult.category || 'N/A').replace(/"/g, '""')}"`;
      const llmResolution = `"${(queryResult.llm_resolution || 'N/A').replace(/"/g, '""')}"`;

      if (historyMatches.length === 0) {
        // Add row with query info but no matches
        csvRows.push([
          query,
          queryCategory,
          llmResolution,
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          'N/A'
        ].join(','));
      } else {
        // Add a row for each history match
        historyMatches.forEach(match => {
          const ticket = `"${(match.ticket || 'N/A').replace(/"/g, '""')}"`;
          const subject = `"${(match.subject || 'N/A').replace(/"/g, '""')}"`;
          const matchCategory = `"${(match.category || 'N/A').replace(/"/g, '""')}"`;
          const similarityScore = match.similarity_score || 0;
          const description = `"${(match.description || 'N/A').replace(/"/g, '""')}"`;
          const resolution = `"${(match.resolution || 'N/A').replace(/"/g, '""')}"`;

          csvRows.push([
            query,
            queryCategory,
            llmResolution,
            ticket,
            subject,
            matchCategory,
            similarityScore,
            description,
            resolution
          ].join(','));
        });
      }
    });

    // Create CSV string
    const csvString = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-container">
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <div className="batch-header-actions">
            <Button
              kind="tertiary"
              size="md"
              renderIcon={Download}
              onClick={handleExportResults}
              className="export-button"
            >
              Export Results
            </Button>
          </div>
          
          <Accordion className="batch-results-accordion" align="start">
            {batchData.map((queryResult, queryIndex) => {
              const historyMatches = queryResult?.history_match || [];
              const sortedMatches = [...historyMatches].sort((a, b) => {
                const scoreA = a.similarity_score || 0;
                const scoreB = b.similarity_score || 0;
                return scoreB - scoreA;
              });

              return (
                <AccordionItem
                  key={queryIndex}
                  open={queryIndex === 0}
                  title={
                    <div className="accordion-title-wrapper">
                      <span className="accordion-query-text">{queryResult.query || 'N/A'}</span>
                      {queryResult.category && (
                        <Tag type={getCategoryColor(queryResult.category)} size="sm" className="accordion-category-tag">
                          {queryResult.category}
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <div className="accordion-content">
                    {sortedMatches.length === 0 ? (
                      <InlineNotification
                        kind="info"
                        title="No Matches"
                        subtitle="No history matches found for this query."
                        hideCloseButton
                      />
                    ) : (
                      <div className="accordion-matches">
                        {sortedMatches.map((match, matchIndex) => (
                          <ResultTile
                            key={matchIndex}
                            match={match}
                            getCategoryColor={getCategoryColor}
                            getSimilarityColorClass={getSimilarityColorClass}
                          />
                        ))}
                      </div>
                    )}

                    <LLMResolutionTile llmResolution={queryResult.llm_resolution} />
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Column>
      </Grid>
    </div>
  );
}

export default BatchResultsList;

