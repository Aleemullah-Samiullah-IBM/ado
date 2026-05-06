import React from 'react';
import { FileUploader, InlineNotification, Loading } from '@carbon/react';
import SearchControls from '../SearchControls/SearchControls';
import './AdvancedTab.scss';

function AdvancedTab({
  batchFile,
  strictCategory,
  setStrictCategory,
  showLlmResolution,
  setShowLlmResolution,
  projectFilter,
  setProjectFilter,
  batchLoading,
  batchError,
  setBatchError,
  handleBatchUpload,
  handleFileChange
}) {
  return (
    <>
      <div className="batch-upload-wrapper">
        <FileUploader
          labelTitle="Upload CSV file"
          labelDescription="Select a CSV file containing queries."
          buttonLabel="Select file"
          filenameStatus="edit"
          accept={['.csv']}
          multiple={false}
          disabled={batchLoading}
          onChange={handleFileChange}
          iconDescription="Clear file"
        />
        
        <SearchControls
          strictCategory={strictCategory}
          setStrictCategory={setStrictCategory}
          showLlmResolution={showLlmResolution}
          setShowLlmResolution={setShowLlmResolution}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          onSearch={handleBatchUpload}
          disabled={batchLoading || !batchFile}
          buttonText="Search"
          strictCategoryId="batch-strict-category"
          showLlmResolutionId="batch-show-llm-resolution"
          projectFilterId="batch-project-filter"
        />

        {batchError && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={batchError}
            onCloseButtonClick={() => setBatchError(null)}
            className="error-notification"
          />
        )}
      </div>

      {batchLoading && (
        <div className="batch-loading-overlay">
          <Loading description="Processing batch file..." withOverlay={false} />
        </div>
      )}
    </>
  );
}

export default AdvancedTab;

