import React, { useState,useEffect} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import L from "leaflet";
import "leaflet.markercluster";
import $ from "jquery";
import {useCookies} from 'react-cookie';

  const Map = () => {
  const [def_pos] = useState({ lat: 53.4417455, lng: -6.1527245 });
  const [map, setMap] = useState(null);
  const [fuel, setFuel] = useState("");

  var iconMarker;
  var fuel_markers;


  const icon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 35],
    iconAnchor: [12, 40],
    popupAnchor: [1, -33],
  });


  function Maplocation(map) 
  {
    updateLocation(map);
  }

  function updateLocation(map) {
    navigator.geolocation.getCurrentPosition(position => {
      setMapToCurrentLocation(map, position);
      database_updated(position);
    });
  }
  
  //  useEffect(() => {
  //    navigator.geolocation.getCurrentPosition((position) => {
  //     setMapToCurrentLocation(map, position);
  //     databaseUpdated(position);
  //   });
  // }, []);



  // useEffect(() => {
  //    if (latLng) {
 // const mapInstance = L.map('map').setView(latLng, 16);
  //      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
//    }).addTo(mapInstance);
  
  function setMapToCurrentLocation(map, position) 
  {
    var latLng = L.latLng(position.coords.latitude, position.coords.longitude);
    

    if (iconMarker) {
      map.removeLayer(iconMarker);
    }

    iconMarker = L.marker(latLng, { icon}).addTo(map);


    iconMarker.bindPopup(
        `Current Location <br> Latitude: ${latLng.lat} <br> Longitude: ${latLng.lng}`
      ).openPopup();
}  

  async function database_updated(pos) 
  {
    const coords = `${pos.coords.longitude}, ${pos.coords.latitude}`;
    
    try {
       await fetch('http://127.0.0.1:8001/api/updated-location/', {
            method: 'POST',
            mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coords }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'token 1885d1bffdd41e7aa20ed9bad273973191b4b63b',
        },

    }).then((response) => {
        if (response.ok) {
          console.log("Sucess");
        }
      });
    } catch (err) { console.error(err);
    }
  }

  async function showPoiMarkers() 
  {


  
    if (fuel_markers) {
      map.removeLayer(fuel_markers);
    }



    $.ajax({
        type: "POST",
        headers: {"Authorization": "token 1885d1bffdd41e7aa20ed9bad273973191b4b63b"},
        url: "http://127.0.0.1:8001/api/golf/",
       data: {
        query: fuel,
        bbox: map.getBounds().toBBoxString(),
      }
      ,
    })
      .done(function (data, xhr, status) {

        fuel_markers = L.markerClusterGroup();

        
        var geoJsonLayer = L.geoJson(data, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon });
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
          },
        });
        fuel_markers.addLayer(geoJsonLayer);


        map.addLayer(geoJsonLayer);
      })
      // fail(function(xhr, status, error){
      //   var message = "Overpass query has failed<br/>";
     //    console.log("Status" + xhr.status + " " + xhr.responseText);
     //    showOkAlert(message);
   //  });
   
  }

  function handlePoiChange(event) {
    setFuel(event.target.value);
  }

  Maplocation(map);
return (
    <div className="Mapclassdiv">
      <div id="styleMap">
        <MapContainer center={def_pos} zoom={16} ref={setMap}>
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a </a>'
          />
        </MapContainer>  
        <input type="text" size="20" onChange={handlePoiChange}/>
        <button type="submit" onClick={showPoiMarkers}>Find Fuel</button>  

      </div>
</div>

  );
};

export default Map;