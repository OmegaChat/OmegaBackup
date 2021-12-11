import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "./assets/scss/files/layout.scss";  
import "./assets/js/appearence";

ReactDOM.render(
  <React.StrictMode>
    <App view={window.location.pathname.slice(1)|| "app"}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// 