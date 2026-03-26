import React from 'react';
import { Tile, Grid, Column } from '@carbon/react';
import { AiLabel } from '@carbon/react/icons';
import './LLMResolutionTile.scss';

function LLMResolutionTile({ llmResolution }) {
  if (!llmResolution) return null;

  return (
    <Grid className="llm-resolution-grid">
      <Column lg={16} md={8} sm={4}>
        <Tile className="llm-resolution-tile">
          <div className="result-header">
            <h4 className="result-subject">✨ LLM Generated Resolution</h4>
            <AiLabel size={20}/>
          </div>
          <div className="result-divider"></div>
          <div className="result-section">
            <p className="result-text">{llmResolution}</p>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}

export default LLMResolutionTile;

