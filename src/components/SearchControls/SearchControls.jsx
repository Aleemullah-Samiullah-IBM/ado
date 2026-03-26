import React from 'react';
import { Checkbox, Button } from '@carbon/react';
import './SearchControls.scss';

function SearchControls({
  strictCategory,
  setStrictCategory,
  showLlmResolution,
  setShowLlmResolution,
  onSearch,
  disabled,
  buttonText = 'Search',
  strictCategoryId = 'strict-category',
  showLlmResolutionId = 'show-llm-resolution'
}) {
  return (
    <div className="search-controls">
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
      
      <Button
        kind="primary"
        size="md"
        onClick={onSearch}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export default SearchControls;

