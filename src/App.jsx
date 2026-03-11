import React, { useState, useRef, useEffect } from 'react';
import {
  Content,
  Theme,
  Grid,
  Column,
  Checkbox,
  Button,
  Tile,
  Loading,
  InlineNotification,
  Tag
} from '@carbon/react';
import { AiLabel } from '@carbon/react/icons';
import Header from './components/Header/Header';
import './App.scss';

function App() {
  const [query, setQuery] = useState('');
  const [strictCategory, setStrictCategory] = useState(true);
  const [useLlmFallback, setUseLlmFallback] = useState(true);
  const [showLlmResolution, setShowLlmResolution] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://moaavm03.dev.fyre.ibm.com:9090/api/v1/resolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          use_llm_fallback: useLlmFallback,
          strict_category: strictCategory,
          show_llm_resolution: showLlmResolution
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(`Failed to fetch results: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight + 2, 200)}px`;
    }
  };

  // Reset textarea height when query is cleared
  useEffect(() => {
    if (query === '' && textareaRef.current) {
      textareaRef.current.style.height = '60px';
    }
  }, [query]);

  // Function to get tag color based on category
  const getCategoryColor = (category) => {
    const categoryColorMap = {
      'CloudOps Support Requests': 'blue',
      'Query': 'cyan',
      'Product Defects': 'red',
      'Infrastructure': 'teal',
      'Security': 'magenta',
      'Feature Request': 'purple',
      'Performance': 'green',
      'Documentation': 'warm-gray',
      'Reliability': 'cool-gray'
    };
    return categoryColorMap[category] || 'gray';
  };

  // Function to get tile color class based on similarity score
  const getSimilarityColorClass = (score) => {
    if (score >= 0.7) return 'high-similarity';
    if (score >= 0.4) return 'medium-similarity';
    return 'low-similarity';
  };

  const renderResults = () => {
    if (!results) return null;

    // Extract history_match array from results
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

    // Sort by similarity_score in descending order (highest first)
    const sortedMatches = [...historyMatches].sort((a, b) => {
      const scoreA = a.similarity_score || 0;
      const scoreB = b.similarity_score || 0;
      return scoreB - scoreA;
    });

    return (
      <div className="results-container">
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
        
        <Grid>
          {sortedMatches.map((match, index) => (
            <Column key={index} lg={16} md={8} sm={4}>
              <Tile className={`result-tile ${getSimilarityColorClass(match.similarity_score || 0)}`}>
                <div className="result-header">
                  <h4 className="result-subject">{match.subject || 'No Subject'}</h4>
                  <span className={`accuracy-badge ${getSimilarityColorClass(match.similarity_score || 0)}`}>
                    Accuracy {((match.similarity_score || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <a
                  href={`https://w3.ibm.com/tools/caseviewer/case/${match.ticket}`}
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
            </Column>
          ))}
        </Grid>

        {/* LLM Resolution - Full Width Tile */}
        {results?.data?.llm_resolution && (
          <Grid className="llm-resolution-grid">
            <Column lg={16} md={8} sm={4}>
              <Tile className="llm-resolution-tile">
                <div className="result-header">
                  <h4 className="result-subject">✨ LLM Generated Resolution</h4>
                  <AiLabel size={20}/>
                </div>
                <div className="result-divider"></div>
                <div className="result-section">
                  <p className="result-text">{results.data.llm_resolution}</p>
                </div>
              </Tile>
            </Column>
          </Grid>
        )}
      </div>
    );
  };

  return (
    <Theme theme="g10">
      <Header />
      <Content className="app-content">
        <Grid className="search-container">
          <Column lg={16} md={8} sm={4}>
            
            <div className="search-wrapper">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your search query..."
                rows={1}
                className="search-textarea"
                disabled={loading}
              />
              
              <div className="search-controls">
                <div className="checkbox-group">
                  <Checkbox
                    id="strict-category"
                    labelText="Search in predicted category"
                    checked={strictCategory}
                    onChange={(e) => setStrictCategory(e.target.checked)}
                    disabled={loading}
                  />
                  <Checkbox
                    id="show-llm-resolution"
                    labelText="Show LLM Resolution"
                    checked={showLlmResolution}
                    onChange={(e) => setShowLlmResolution(e.target.checked)}
                    disabled={loading}
                  />
                </div>
                
                <Button
                  kind="primary"
                  size="md"
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                >
                  Search
                </Button>
              </div>
            </div>

            {error && (
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={error}
                onCloseButtonClick={() => setError(null)}
                className="error-notification"
              />
            )}

            {loading && (
              <div className="loading-container">
                <Loading description="Searching..." withOverlay={false} />
              </div>
            )}
          </Column>
        </Grid>

        {renderResults()}
      </Content>
    </Theme>
  );
}

export default App;

// Made with Bob
