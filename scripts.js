// AIzaSyA9c1IbHOE57PaRtxU_N4Rdit8Wad3Zma0 KEY
// js for map 
var map = L.map('map').setView([47.2452,-122.4582],12);
// This ist just testing map2 which is to test the google maps api
// var map2 = L.map('map2').setView([47.2452,-122.4582],12);
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
// }).addTo(map2);

var latlng = L.latLng(0,0);
var marker = L.marker(latlng,{
  draggable: false,
  autoPan: true
}).addTo(map);

// var myAPIKey = "f5b6e12c640547b1bfedad5fc4a1456f"; // Get an API Key on https://myprojects.geoapify.com

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
    layer.on('mouseover', function () {
      // console.log(feature.properties.TRACTCE);
      createTextBoxControl2("Census Tract#: " + feature.properties.TRACTCE);
    });
    layer.on('mouseout', function () {
      textBoxControl2.remove();
    });
  }
}).addTo(map);

// Add Geoapify Address Search control 
// const addressSearchControl = L.control.addressSearch(myAPIKey, {
//   position: 'topright',
//   resultCallback: (address) => {
//     // if there is currently a marker clear it 
//     if (marker) {
//       marker.remove();
//     }
//     // if there is not a address nothing is returned 
//     if (!address) {
//       return;
//     }

//     // testing lat lon for later use 
//     console.log(address.lat)
//     console.log(address.lon)
//     var pt = turf.point([address.lon,address.lat])

//     // This is supposed to iterate though each of the census tracts if bool3 comes out as true it logs, if not than it remains false 
//     var turfPolygons = [];
//     var count = (0);
//     var bool3 = (false);
//     var boolf = (true);
//     tract.features.forEach(function(feature) {
//       var polygon = turf.polygon(feature.geometry.coordinates);
//       turfPolygons = (polygon);
//       bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
//       count = (count + 1);
//       if (bool3) {
//         boolf = (false);
//         alert("This census address is applicable.");
        
//       }
//     });
//     if (boolf) {
//       alert("This census address IS NOT applicable");
//     }

//     console.log(count);
//     // adds marker to map at the point of the address 
//     marker = L.marker([address.lat, address.lon]).addTo(map);
//     // Sets the view to the location of where the address is 
//     if (address.bbox && address.bbox.lat1 !== address.bbox.lat2 && address.bbox.lon1 !== address.bbox.lon2) {
//       map.fitBounds([[address.bbox.lat1, address.bbox.lon1], [address.bbox.lat2, address.bbox.lon2]], { padding: [100, 100] })
//     } else {
//       map.setView([address.lat, address.lon], 15);
//     }
//   },
//   suggestionsCallback: (suggestions) => {
//     console.log(suggestions);
//   }
// });
// map.addControl(addressSearchControl);

// This is where testing starts 


// KEEP THIS MARKER CODE TO MANUALLY TEST IF MARKER IS INSIDE OF CENUS TRACTS FOR LATER 
var latlng = L.latLng(47.2452,-122.4582);

// var marker = L.marker(latlng,{
//   draggable: true,
//   autoPan: true
// }).addTo(map);

// marker.on('dragend', function (e) {
// latlng = L.latLng(marker.getLatLng().lat, marker.getLatLng().lng);
// console.log(latlng);
// });

// map.on('click', function (e) {
// marker.setLatLng(e.latlng);
// latlng = L.latLng(marker.getLatLng().lat, marker.getLatLng().lng);
// console.log(latlng);
// });


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
      createTextBoxControl("This address IS eligible");
    }
  });
  // this will log the number of census tracts searched through 
  console.log(count);
  if (boolf) {
    createTextBoxControl("This address IS NOT eligible");
  }
  // this sets the latlng variable which stores the lat lon ponints for where the user clicks, but idk if its used 
  latlng = L.latLng(marker.getLatLng().lat, marker.getLatLng().lng);
  // console.log(latlng);
  }); 

  // Testing text box 

// Define the text box control outside the click event handler this allows me to pass the function inside my click event listener and the geosearch
var textBoxControl;

// Creates the text box control function, this is used above to tell the user if they are eligbable or not.
function createTextBoxControl(content) {
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

// function updateLatLng(lat,lng) {
// document.getElementById('latitude').value = marker.getLatLng().lat;
// document.getElementById('longitude').value = marker.getLatLng().lng;
// }

// This part is having issues, if i want a new geocoder 
// const searchControl  = new GeoSearch.GeoSearchControl({
// style: 'bar',
// provider: new GeoSearch.OpenStreetMapProvider ({
// showMarker: true,
// marker: marker, // use custom marker, not working?
// }),
// });
// map.addControl(searchControl);

// const search = new GeoSearch.GeoSearchControl({
//   provider: new GeoSearch.OpenStreetMapProvider(),
// });

// map.addControl(search);

// trouble shooting new geocoder  (leaflet-control-geocoder) WORKS
// L.Control.geocoder({
//   geocoder: L.Control.Geocoder.nominatim()
// }).addTo(map);

// Anouther try 
// This is whats being recomended on Stack Overflow 
// let googleGeoCoderProvider = L.Control.Geocoder.google({
//   apiKey: 'AIzaSyA9c1IbHOE57PaRtxU_N4Rdit8Wad3Zma0',
// }).on('markgeocode', function (event) {
//   var location = event.geocode.center;

//   // Remove the previous marker if it exists
//   if (marker) {
//       map.removeLayer(marker);
//   }
//   // Add a new marker at the selected location
//   marker = L.marker(location).addTo(map);
//   map.setView(location, 13);
//   // Just testing getting lat lon points from leaflet-control-geocoder 
//   // This is where code is reused to test if the geosearched locations is within one of the census tracts 
//   var loc = marker.getLatLng();
//   console.log("lat: ", loc.lat);
//   console.log("long: ", loc.lng);
//   var pt = turf.point([marker.getLatLng().lng, marker.getLatLng().lat]);
//   console.log(pt);
//   // This is supposed to iterate though each of the census tracts if bool3 comes out as true it logs, if not than it remains false 
//   var turfPolygons = [];
//   var count = (0);
//   var bool3 = (false);
//   var boolf = (true);
//   tract.features.forEach(function(feature) {
//     var polygon = turf.polygon(feature.geometry.coordinates);
//     turfPolygons = (polygon);
//     bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
//     count = (count + 1);
//     if (bool3) {
//       boolf = (false);
//       createTextBoxControl("This address IS eligible");
//     }
//   });
//   if (boolf) {
//     createTextBoxControl("This address IS NOT eligible");
//   }
// }).addTo(map);

// Try 2 
// let googleGeoCoderProvider = L.Control.Geocoder.google({
//   apiKey: 'AIzaSyAkYLkNcozn6vdqps5Pc0-ZNfIcawiavVg'
// });
// L.Control.geocoder({
//   placeholder: 'Search for a location...',
//   collapsed: false,
//   geocoder: googleGeoCoderProvider,
// }).addTo(map);

// Try 3 
// var geocoder = L.Control.geocoder({
//   defaultMarkGeocode: false,
//   collapsed: false,
//   placeholder: 'Search for a location...',
//   // geocoder: L.Control.Geocoder.google('AIzaSyA9c1IbHOE57PaRtxU_N4Rdit8Wad3Zma0')
//   // geocoder: function(query, callback) {
//   //   var geocoder = new google.maps.Geocoder();
//   //   geocoder.geocode({ address: query }, function(results, status) {
//   //     if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
//   //       var location = results[0].geometry.location;
//   //       callback(location, results[0].formatted_address);
//   //     } else {
//   //       callback(null);
//   //     }
//   //   });
//   // }
//   // geocoder: L.Control.Geocoder.nominatim()
//   // COME BACK TO THIS ONCE I HAVE A GOOGLE API KEY 
//   // AIzaSyA9c1IbHOE57PaRtxU_N4Rdit8Wad3Zma0 KEY
//   geocoder: L.Control.Geocoder.google({
//       apiKey: 'AIzaSyA9c1IbHOE57PaRtxU_N4Rdit8Wad3Zma0' // Replace with your Google API key
//   })
// }).on('markgeocode', function (event) {
//   var location = event.geocode.center;

//   // Remove the previous marker if it exists
//   if (marker) {
//       map.removeLayer(marker);
//   }
//   // Add a new marker at the selected location
//   marker = L.marker(location).addTo(map);
//   map.setView(location, 13);
//   // Just testing getting lat lon points from leaflet-control-geocoder 
//   // This is where code is reused to test if the geosearched locations is within one of the census tracts 
//   var loc = marker.getLatLng();
//   console.log("lat: ", loc.lat);
//   console.log("long: ", loc.lng);
//   var pt = turf.point([marker.getLatLng().lng, marker.getLatLng().lat]);
//   console.log(pt);
//   // This is supposed to iterate though each of the census tracts if bool3 comes out as true it logs, if not than it remains false 
//   var turfPolygons = [];
//   var count = (0);
//   var bool3 = (false);
//   var boolf = (true);
//   tract.features.forEach(function(feature) {
//     var polygon = turf.polygon(feature.geometry.coordinates);
//     turfPolygons = (polygon);
//     bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
//     count = (count + 1);
//     if (bool3) {
//       boolf = (false);
//       createTextBoxControl("This address IS eligible");
//     }
//   });
//   if (boolf) {
//     createTextBoxControl("This address IS NOT eligible");
//   }
// }).addTo(map);

// Try 4 
// let googleGeoCoderProvider = L.Control.Geocoder.google('AIzaSyAkYLkNcozn6vdqps5Pc0-ZNfIcawiavVg');

// L.Control.geocoder({
//   placeholder: 'Search for a location...',
//   collapsed: false,
//     geocoder: googleGeoCoderProvider,
// }).addTo(map);

// ORIGINAL works 
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
  collapsed: false,
  placeholder: 'Search for a location...',
  // geocoder: L.Control.Geocoder.nominatim()
  // COME BACK TO THIS ONCE I HAVE A GOOGLE API KEY 
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
      createTextBoxControl("This address IS eligible");
    }
  });
  if (boolf) {
    createTextBoxControl("This address IS NOT eligible");
  }
}).addTo(map);

// Mapbox with leaflet control geocoder test 

// let googleGeoCoderProvider = L.Control.Geocoder.mapbox({
//   apiKey: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbDl5d3h6NzkwOTdoM29xb20xYzJ3NmZsIn0.sMhj9jD84igqnZdX08l33A'
// });
// L.Control.geocoder({
//   placeholder: 'Search for a location...',
//   collapsed: false,
//   geocoder: googleGeoCoderProvider,
// }).addTo(map);


