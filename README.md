# ADO - Root Cause Analyzer

A React application built with IBM Carbon Design System for searching and analyzing root causes.

## Features

- Clean, centered search interface with Carbon components
- Three configurable options:
  - Strict
  - Use LLM Fallback
  - Show LLM Resolution
- API integration with POST endpoint
- Results displayed as Carbon tiles/cards
- Responsive design
- Dark theme (g100)

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## API Endpoint

The application connects to:
```
POST http://moaavm03.dev.fyre.ibm.com:9090/api/v1/resolution
```

## Usage

1. Enter your search query in the text box
2. Select desired options using the checkboxes
3. Press Enter or click the Send icon
4. View results displayed as cards below

## Technologies Used

- React 18
- IBM Carbon Design System (@carbon/react)
- Carbon Icons
- SCSS for styling