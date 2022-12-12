import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './components/Login';
import Map from './components/Map';
import {Route, BrowserRouter,Routes} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';
import * as serviceWorker from "../src/serviceWorker"


function Router(){
  return(
<BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="Map" element={<Map />} />
      <Route exact path="overpass" element={<Map />} />
    </Routes>
</BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

  
    
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.register();
reportWebVitals();
