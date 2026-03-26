import React from 'react';
import { Grid, Column, Slider } from '@carbon/react';
import './AccuracyFilter.scss';

function AccuracyFilter({
  minAccuracy,
  maxAccuracy,
  setMinAccuracy,
  setMaxAccuracy,
  filteredCount,
  totalCount
}) {
  return (
    <Grid className="accuracy-filter-grid">
      <Column lg={16} md={8} sm={4}>
        <div className="accuracy-filter-section">
          <div className="filter-row">
            <div className="results-counter">
              Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> results
            </div>
            <div className="filter-slider">
              <Slider
                ariaLabelInput="Minimum accuracy"
                unstable_ariaLabelInputUpper="Maximum accuracy"
                labelText="Filter by Accuracy Range (%)"
                value={minAccuracy}
                unstable_valueUpper={maxAccuracy}
                min={0}
                max={100}
                step={1}
                stepMultiplier={10}
                onChange={({ value, valueUpper }) => {
                  setMinAccuracy(value);
                  setMaxAccuracy(valueUpper);
                }}
              />
            </div>
          </div>
        </div>
      </Column>
    </Grid>
  );
}

export default AccuracyFilter;

