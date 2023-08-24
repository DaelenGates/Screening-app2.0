
// js for map 
var map = L.map('map').setView([47.2452,-122.4582],12);

var latlng = L.latLng(0,0);
var marker = L.marker(latlng,{
  draggable: false,
  autoPan: true
}).addTo(map);

// my basemap
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
}).addTo(map);

// Adds in the Geojson of applicable census tracts 
var tracts = L.geoJson(tract,{
  interactive: false,
  PointToLayer: function(feature, latlng){
  }
}).addTo(map);

var tracts = L.geoJSON(tract, {
  PointToLayer: function(feature, latlng){
  },
  onEachFeature: function (feature, layer) {
    layer.on('click', function () {
      // console.log(feature.properties.TRACTCE);
      createTextBoxControl2("Census Tract#: " + feature.properties.TRACTCE);
    });
  }
}).addTo(map);

// KEEP THIS MARKER CODE TO MANUALLY TEST IF MARKER IS INSIDE OF CENUS TRACTS FOR LATER 
var latlng = L.latLng(47.2452,-122.4582);

// This section will add an on click function that allows the marker to be placed manually
map.on('click', function (e) {
  // This creates the marker that people see where the user clickes 
  marker.setLatLng(e.latlng);
  // Creates a turf point that can be tested out of the marcer location location 
  var pt = turf.point([marker.getLatLng().lng, marker.getLatLng().lat])

  // Remove the existing text box control if it exists
  if (textBoxControl) {
    textBoxControl.remove();
  }
  // This iterates through the applicable census tracts and asks IF pt is inside of any of them one at at time 
  var turfPolygons = [];
  var count = (0); // this count is to count the number of census tracts, it maybe can be removed later
  var bool3 = (false);
  var boolf = (true);
  tract.features.forEach(function(feature) {
    var polygon = turf.polygon(feature.geometry.coordinates);
    turfPolygons = (polygon);
    bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
    count = (count + 1);
    // console.log("boolf = " + boolf)
    // console.log ("bool3 = " + bool3)
    if (bool3) {
      boolf = (false);
      createTextBoxControl("This address IS eligible", "green");
    }
  });
  // this will log the number of census tracts searched through 
  console.log(count);
  if (boolf) {
    createTextBoxControl("This address IS NOT eligible", "red");
    // This removes the census tract text box ( Text box control 2) if the marker is NOT inside a eligible census tract 
    textBoxControl2.remove();
  }
  // this sets the latlng variable which stores the lat lon ponints for where the user clicks, but idk if its used 
  latlng = L.latLng(marker.getLatLng().lat, marker.getLatLng().lng);
  // console.log(latlng);
  }); 

  // Testing text box 

// Define the text box control outside the click event handler this allows me to pass the function inside my click event listener and the geosearch
var textBoxControl;

// Creates the text box control function, this is used above to tell the user if they are eligbable or not.
function createTextBoxControl(content, color) {
  // Removes the existing text box control if it exists
  if (textBoxControl) {
    textBoxControl.remove();
  }

  // Create the new text box control
  textBoxControl = L.control({ position: 'bottomright' });

  // Define the content of the text box
  textBoxControl.onAdd = function(map) {
    var textBox = L.DomUtil.create('div', 'text-box');
    textBox.innerHTML = content;

    // changes color depending on eligability
    textBox.style.backgroundColor = color;

    // changes font size to be larger 
    textBox.style.fontSize = '40px';

    return textBox;
  };

  // Add the text box control to the map
  textBoxControl.addTo(map);
}

// Here is where the 2nd Text box control will be set that will show census tract when hovered over 
// Define the text box control outside the click event handler this allows me to pass the function inside my click event listener and the geosearch
var textBoxControl2;

// Creates the text box control function, this is used above to tell the user if they are eligbable or not.
function createTextBoxControl2(content) {
  // Removes the existing text box control if it exists
  if (textBoxControl2) {
    textBoxControl2.remove();
  }

  // Create the new text box control
  textBoxControl2 = L.control({ position: 'bottomleft' });

  // Define the content of the text box
  textBoxControl2.onAdd = function(map) {
    var textBox = L.DomUtil.create('div', 'text-box');
    textBox.innerHTML = content;

    return textBox;
  };

  // Add the text box control to the map
  textBoxControl2.addTo(map);
}

// ORIGINAL works 
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  collapsed: false,
  placeholder: 'Search for a location...',
  // OSM Geocoder 
  // geocoder: L.Control.Geocoder.nominatim()
  // COME BACK TO THIS ONCE I HAVE A GOOGLE API KEY (GOOGLE GEOCODER)
  // AIzaSyA9c1IbHOE57PaRtxU_N4Rdit8Wad3Zma0 KEY
  // geocoder: L.Control.Geocoder.google({
  //     apiKey: 'AIzaSyAkYLkNcozn6vdqps5Pc0-ZNfIcawiavVg' // Replace with your Google API key
  // })
  // // Mapbox Geocoder 
  geocoder: L.Control.Geocoder.mapbox({
    apiKey: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbDl5d3h6NzkwOTdoM29xb20xYzJ3NmZsIn0.sMhj9jD84igqnZdX08l33A'
  })
}).on('markgeocode', function (event) {
  var location = event.geocode.center;

  // Remove the previous marker if it exists
  if (marker) {
      map.removeLayer(marker);
  }
  // Add a new marker at the selected location
  marker = L.marker(location).addTo(map);
  map.setView(location, 13);
  // Just testing getting lat lon points from leaflet-control-geocoder 
  // This is where code is reused to test if the geosearched locations is within one of the census tracts 
  var loc = marker.getLatLng();
  console.log("lat: ", loc.lat);
  console.log("long: ", loc.lng);
  var pt = turf.point([marker.getLatLng().lng, marker.getLatLng().lat]);
  console.log(pt);
  // This is supposed to iterate though each of the census tracts if bool3 comes out as true it logs, if not than it remains false 
  var turfPolygons = [];
  var count = (0);
  var bool3 = (false);
  var boolf = (true);
  tract.features.forEach(function(feature) {
    var polygon = turf.polygon(feature.geometry.coordinates);
    turfPolygons = (polygon);
    bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
    count = (count + 1);
    if (bool3) {
      boolf = (false);
      createTextBoxControl("This address IS eligible", 'green');
      // This will tell the user what census tract the marker is at when they search an address 
      createTextBoxControl2("Census Tract#: " + feature.properties.TRACTCE);
    }
  });
  if (boolf) {
    createTextBoxControl("This address IS NOT eligible", 'red');
    // This removes the census tract text box ( Text box control 2) if the marker is NOT inside a eligible census tract 
    textBoxControl2.remove();
  }
}).addTo(map);
