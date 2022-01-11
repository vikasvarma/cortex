// React Modules:
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './client/components/Home'

// Style Components:
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Home user={0}/>
  </React.StrictMode>,
  document.getElementById('root')
);