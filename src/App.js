import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar.js';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';

function App() {

  const[data, setDatas] = useState([])

useEffect(() => {
  fetch('http://127.0.0.1:8001/users/', {
    method: "GET",
    mode: 'cors',
    headers: { 
      'Content-Type': 'application/json' ,
      Authorization: 'token 1885d1bffdd41e7aa20ed9bad273973191b4b63b',
    }
  })

  .then(resp => resp.json())
  .then(resp => setDatas(resp))
  .then(error => console.log(error))

}, [])



if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
  navigator.serviceWorker.register('serviceWorker.js').then(function(registration) {
  // Registration was successful
  console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }, function(err) {
  // registration failed :(
  console.log('ServiceWorker registration failed: ', err);
  });
  });
  }








  return (

    
    <div className="App">

    <div>
      <Navbar />
    </div>

      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Django And React App</h1>
        {
          data.map(data => {
            return (
              <div key =  {data.url}>
                <h2>{data.is_staff}</h2>
                <p>Username: {data.username} </p>
                <p>Email: {data.email}</p>
              </div>
            )
          }
            )
        }
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}





export default App;
