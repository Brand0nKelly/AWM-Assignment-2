import React, { useState,useEffect} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import {useCookies} from 'react-cookie';
import '../index.css';
import '../Images/marker-icon-2x.png';
import createGolfCourseMarkers from "./overpass";
import map from 'leaflet'




function Map() {
  // create a React state to store the map and GeoJSON data
  const [map, setMap] = useState(null);
  const [geojson, setGeojson] = useState(null);

  // a hook to initialize the map when the component mounts
  useEffect(() => {
    // create a new Leaflet map
    const leafletMap = L.map('map', {
      center: [0, 0],
      zoom: 1,
      zoomControl: false
    });

    // add a base layer to the map
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(leafletMap);

    // save the map instance to the React state
    setMap(leafletMap);
  }, []);

  // a hook to fetch the GeoJSON data and add it to the map
  useEffect(() => {
    // only fetch the data if the map is defined
    if (map) {
      // fetch the GeoJSON data from the Overpass API
      const url = 'https://overpass-api.de/api/interpreter?';
      const data = ('[out:json][timeout:25];(node["leisure"="golf_course"]({south},{west},{north},{east});way["leisure"="golf_course"]({south},{west},{north},{east});relation["leisure"="golf_course"]({south},{west},{north},{east}););out body;>;out skel qt;')
        .then(response => response.json(url,data))
        .then(data => {
          // create a GeoJSON layer with the fetched data
          const geojsonLayer = L.geoJson(data);

          // add the GeoJSON layer to the map
          geojsonLayer.addTo(map);

          // save the GeoJSON layer to the React state
          setGeojson(geojsonLayer);
        });
    }
  }, [map]);

  // a hook to remove the GeoJSON layer when the component unmounts
  useEffect(() => {
    return () => {
      // only remove the layer if it exists
      if (geojson) {
        map.removeLayer(geojson);
      }
    };
  }, [geojson, map]);

  // render the map
  return <div id="map" style={{ height: '400px' }} />;
}