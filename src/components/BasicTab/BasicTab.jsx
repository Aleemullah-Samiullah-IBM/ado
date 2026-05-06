import React from 'react';
import { InlineNotification, Loading } from '@carbon/react';
import SearchControls from '../SearchControls/SearchControls';
import './BasicTab.scss';

function BasicTab({
  query,
  setQuery,
  strictCategory,
  setStrictCategory,
  showLlmResolution,
  setShowLlmResolution,
  projectFilter,
  setProjectFilter,
  loading,
  error,
  setError,
  handleSearch,
  textareaRef,
  handleInputChange,
  handleKeyDown
}) {
  return (
    <>
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
        
        <SearchControls
          strictCategory={strictCategory}
          setStrictCategory={setStrictCategory}
          showLlmResolution={showLlmResolution}
          setShowLlmResolution={setShowLlmResolution}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          onSearch={handleSearch}
          disabled={loading || !query.trim()}
          buttonText="Search"
          strictCategoryId="strict-category"
          showLlmResolutionId="show-llm-resolution"
          projectFilterId="project-filter"
        />

        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onCloseButtonClick={() => setError(null)}
            className="error-notification"
          />
        )}
      </div>

      {loading && (
        <div className="search-loading-overlay">
          <Loading description="Searching..." withOverlay={false} />
        </div>
      )}
    </>
  );
}

export default BasicTab;

