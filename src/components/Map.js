import React, { useState,useEffect} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import {useCookies} from 'react-cookie';
import '../index.css';
import '../Images/marker-icon-2x.png';
import createGolfCourseMarkers from "./overpass";

import { Icon } from 'leaflet'



const MyMap = () => {
    const [latLng, setLatLng] = useState(null);
    const [map, setMap] = useState(null);
    const [geojson, setGeojson] = useState(null);
  
    useEffect(() => {
      // Get the user's current location using the Geolocation API
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLatLng([latitude, longitude]);


        fetch('http://127.0.0.1:8001/api/updated-location/', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ latitude, longitude, }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'token 1885d1bffdd41e7aa20ed9bad273973191b4b63b',
            },
  
            
          });


      });
    }, []);



    useEffect(() => {
      if (latLng) {
        const mapInstance = L.map('map').setView(latLng, 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(mapInstance);






const icon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

<Popup>
    Your location is: {latLng}
</Popup>

const marker = L.marker(latLng, { icon }).addTo(mapInstance);
        setMap(mapInstance);
      }
    }, [latLng]);
  

    
    return <div id="map" style={{ height: '750px', width: '100%' , marginTop:'2%' }} />;
  };
  

export default MyMap;
