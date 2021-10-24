import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactQueryProvider from 'components/ReactQueryProvider';

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
