import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Import BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css'; // Make sure your CSS is imported

// Find the root element in your public/index.html
const rootElement = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Initial render: Render the App component wrapped in BrowserRouter
root.render(
  <React.StrictMode>
    {/* 2. Wrap the App component */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
