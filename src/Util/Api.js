export function showPoiMarkers() {
    console.log("In showPoiMarkers");
    
    // If we have markers on the map from a previous query, we remove them.
    if (poi_markers) {
        map.removeLayer(poi_markers);
    }
    
    // Create an Icon object which has a specific look.
    var icon = L.BeautifyIcon.icon(poiIconOptions);
    
    // Show a spinner to indicate Ajax call in progress.
    toggleCentredSpinner("show");
    
    /*
    * Create the AJAX call. Note that we only ever have four elemwnts.
    * 1. The verb. Typically GET, POST, PUT, PATCH or DELETE.
    * 2. Any headers necessary. In this case we send back the authorization token received earlier from a login process.
    * 3. The target URL. In this example, I get this from an array of the available REST URLs.
    * 4. The body or payload. This is the data for the query, in this case, the map viewport bounding box coordinates 
    * and the user-entered query. $("#query-text") is a text box.
    * 
    * Note that AJAX has some callback functions.
    * 1. 'done' when the AJAX call was successful (code 2xx).
    * 2. 'fail' when the server returned an error (4xx).
    * 3. 'always' whether the call was successful or not.
    * */
    $.ajax({
        type: "POST",
        headers: {"Authorization": localStorage.authtoken},
        url: restEndpoints["osm-query"],
        data: {
            query: $("#query-text").val(),
            bbox: map.getBounds().toBBoxString()
        }
    }).done(function (data, status, xhr) {
        
        //Create a cluster group for our markers to avoid clutter. 'Marker Cluster' is a Leaflet plugin.
        poi_markers = L.markerClusterGroup();
        
        // Handle GeoJSON response from the server.
        var geoJsonLayer = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                // Associate each point with the icon we made earlier
                return L.marker(latlng, {icon: icon});
            },
            onEachFeature: function (feature, layer) {
                // For each feature associate a popup with the 'name' property
                layer.bindPopup(feature.properties.name);
            }
        });
        
        // Add the GeoJSON layer to the cluster.
        poi_markers.addLayer(geoJsonLayer);
        
        // Add the cluster to the map.
        map.addLayer(poi_markers);
    }).fail(function (xhr, status, error) {
        var message = "OSM Overpass query failed.<br/>";
        console.log("Status: " + xhr.status + " " + xhr.responseText);
        showOkAlert(message);
    }).always(function () {
        toggleCentredSpinner("hide");
    });
}