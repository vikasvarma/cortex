// React Modules:
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home'

// Style Components:
import './index.css'
import GlobalStyles from './styles/global.styles'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);