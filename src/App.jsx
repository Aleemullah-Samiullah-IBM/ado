import React, { useState, useRef, useEffect } from 'react';
import {
  Content,
  Theme,
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@carbon/react';
import Header from './components/Header/Header';
import BasicTab from './components/BasicTab/BasicTab';
import AdvancedTab from './components/AdvancedTab/AdvancedTab';
import ResultsList from './components/ResultsList/ResultsList';
import BatchResultsList from './components/BatchResultsList/BatchResultsList';
import './App.scss';

function App() {
  // Single search state
  const [query, setQuery] = useState('');
  const [strictCategory, setStrictCategory] = useState(true);
  const [useLlmFallback, setUseLlmFallback] = useState(true);
  const [showLlmResolution, setShowLlmResolution] = useState(true);
  const [projectFilter, setProjectFilter] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minAccuracy, setMinAccuracy] = useState(70);
  const [maxAccuracy, setMaxAccuracy] = useState(100);
  const textareaRef = useRef(null);

  // Batch upload state
  const [batchFile, setBatchFile] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState(null);
  const [batchResults, setBatchResults] = useState(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState(0);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Transform comma-separated project names to uppercase array
      const projectFilterArray = projectFilter
        .split(',')
        .map(p => p.trim().toUpperCase())
        .filter(p => p.length > 0);

      const requestBody = {
        query: query,
        use_llm_fallback: useLlmFallback,
        strict_category: strictCategory,
        show_llm_resolution: showLlmResolution
      };

      // Only add project_filter if there are values
      if (projectFilterArray.length > 0) {
        requestBody.project_filter = projectFilterArray;
      }

      const response = await fetch('http://moaavm03.dev.fyre.ibm.com:9090/api/v1/resolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
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

  const handleBatchUpload = async () => {
    if (!batchFile) {
      setBatchError('Please select a CSV file');
      return;
    }

    setBatchLoading(true);
    setBatchError(null);
    setBatchResults(null);

    try {
      // Transform comma-separated project names to uppercase array
      const projectFilterArray = projectFilter
        .split(',')
        .map(p => p.trim().toUpperCase())
        .filter(p => p.length > 0);

      const formData = new FormData();
      formData.append('file', batchFile);
      formData.append('use_llm_fallback', useLlmFallback);
      formData.append('strict_category', strictCategory);
      formData.append('show_llm_resolution', showLlmResolution);
      
      // Only add project_filter if there are values
      if (projectFilterArray.length > 0) {
        formData.append('project_filter', JSON.stringify(projectFilterArray));
      }

      const response = await fetch('http://moaavm03.dev.fyre.ibm.com:9090/api/v1/batch', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBatchResults(data);
    } catch (err) {
      setBatchError(`Failed to process batch file: ${err.message}`);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setBatchError('Please select a CSV file');
        setBatchFile(null);
        return;
      }
      setBatchFile(file);
      setBatchError(null);
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

  // Handle tab change
  const handleTabChange = (evt) => {
    setActiveTab(evt.selectedIndex);
  };

  return (
    <Theme theme="g10">
      <Header />
      <Content className="app-content">
        <Grid className="search-container">
          <Column lg={16} md={8} sm={4}>
            <Tabs selectedIndex={activeTab} onChange={handleTabChange}>
              <TabList aria-label="Search mode tabs" contained>
                <Tab>Basic</Tab>
                <Tab>Advanced</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <BasicTab
                    query={query}
                    setQuery={setQuery}
                    strictCategory={strictCategory}
                    setStrictCategory={setStrictCategory}
                    showLlmResolution={showLlmResolution}
                    setShowLlmResolution={setShowLlmResolution}
                    projectFilter={projectFilter}
                    setProjectFilter={setProjectFilter}
                    loading={loading}
                    error={error}
                    setError={setError}
                    handleSearch={handleSearch}
                    textareaRef={textareaRef}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                  />
                </TabPanel>

                <TabPanel>
                  <AdvancedTab
                    batchFile={batchFile}
                    strictCategory={strictCategory}
                    setStrictCategory={setStrictCategory}
                    showLlmResolution={showLlmResolution}
                    setShowLlmResolution={setShowLlmResolution}
                    projectFilter={projectFilter}
                    setProjectFilter={setProjectFilter}
                    batchLoading={batchLoading}
                    batchError={batchError}
                    setBatchError={setBatchError}
                    handleBatchUpload={handleBatchUpload}
                    handleFileChange={handleFileChange}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Column>
        </Grid>

        {activeTab === 0 && (
          <ResultsList
            results={results}
            minAccuracy={minAccuracy}
            maxAccuracy={maxAccuracy}
            setMinAccuracy={setMinAccuracy}
            setMaxAccuracy={setMaxAccuracy}
            getCategoryColor={getCategoryColor}
            getSimilarityColorClass={getSimilarityColorClass}
          />
        )}

        {activeTab === 1 && (
          <BatchResultsList
            batchResults={batchResults}
            getCategoryColor={getCategoryColor}
            getSimilarityColorClass={getSimilarityColorClass}
          />
        )}
      </Content>
    </Theme>
  );
}

export default App;

