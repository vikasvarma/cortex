// React Modules:
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './client/components/Home'

// Style Components:
import './index.css'
import GlobalStyles from './client/styles/global.styles'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);

fetch('http://localhost:5000/user?userid=vikas@gmail.com')
.then(response => {
  console.log(response);
  return response.json();
}).then(data => {
  // Work with JSON data here
  console.log(data);
}).catch(err => {
  // Do something for an error here
  console.log("Error Reading data " + err);
});