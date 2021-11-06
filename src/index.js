import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { customCreateStore } from './store';

ReactDOM.render(
  <React.StrictMode>
    <App store={customCreateStore()}/>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
