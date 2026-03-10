import React from 'react';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">
        <span className="header-title--prefix">IBM</span> ADO - Root Cause Analyzer
      </h1>
      <div className="header-actions">
        {/* Future actions can be added here */}
      </div>
    </header>
  );
}

export default Header;

// Made with Bob
