import React from 'react';
import { Checkbox, Button, TextInput } from '@carbon/react';
import './SearchControls.scss';

function SearchControls({
  strictCategory,
  setStrictCategory,
  showLlmResolution,
  setShowLlmResolution,
  projectFilter,
  setProjectFilter,
  onSearch,
  disabled,
  buttonText = 'Search',
  strictCategoryId = 'strict-category',
  showLlmResolutionId = 'show-llm-resolution',
  projectFilterId = 'project-filter'
}) {
  return (
    <div className="search-controls">
      <div className="controls-row">
        <div className="checkbox-group">
          <Checkbox
            id={strictCategoryId}
            labelText="Search in predicted category"
            checked={strictCategory}
            onChange={(e) => setStrictCategory(e.target.checked)}
            disabled={disabled}
          />
          <Checkbox
            id={showLlmResolutionId}
            labelText="Show LLM Resolution"
            checked={showLlmResolution}
            onChange={(e) => setShowLlmResolution(e.target.checked)}
            disabled={disabled}
          />
        </div>
        
        <TextInput
          id={projectFilterId}
          labelText="Project name"
          hideLabel={true}
          placeholder="Enter project names (comma-separated)"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          disabled={disabled}
        />
        
        <Button
          kind="primary"
          size="md"
          onClick={onSearch}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export default SearchControls;

