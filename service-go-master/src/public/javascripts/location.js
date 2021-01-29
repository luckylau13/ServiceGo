let geoCoder;
let latlngbounds;
let allLatLng = [];

function initLocationMap() {
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();
  geoCoder = new google.maps.Geocoder();
  latlngbounds = new google.maps.LatLngBounds();
  let address = JSON.parse(localStorage.getItem("currentLocation"));
  // Map options
  let options = {
    zoom: 14,
    center: JSON.parse(localStorage.getItem("currentLocation"))
  };
  // Initi New map instance
  let map = new google.maps.Map(
    document.getElementById("locationmap"),
    options
  );

  let marker = new google.maps.Marker({
    position: JSON.parse(localStorage.getItem("currentLocation")),
    map: map
  });
  let infoWindow = new google.maps.InfoWindow({
    content: "<p class='lead'> Your location.</p>"
  });

  marker.addListener("click", () => {
    infoWindow.open(window.searchmap, marker);
  });
  allLatLng.push(new google.maps.LatLng(address.lat, address.lng));

  let userLocation = document.getElementById("sLoc").value;
  geoCoder.geocode({ address: userLocation }, (results, status) => {
    if (status == "OK") {
      currentLatLong = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      };
      // Set the direction renderer to the map instance above
      directionsRenderer.setMap(map);
      calculateAndDisplayRoute(
        directionsService,
        directionsRenderer,
        currentLatLong,
        map
      );
    }
  });
}

function calculateAndDisplayRoute(
  directionsService,
  directionsRenderer,
  currentLatLong,
  map
) {
  let waypoints = [];
  let startLatLang = new google.maps.LatLng(
    JSON.parse(localStorage.getItem("currentLocation"))
  );

  let destLatLang = new google.maps.LatLng(currentLatLong);
  allLatLng.push(
    new google.maps.LatLng(currentLatLong.lat, currentLatLong.lng)
  );
  // loop through the all locations and extend the map accordingly
  for (var i = 0; i < allLatLng.length; i++) {
    latlngbounds.extend(allLatLng[i]);
  }
  map.fitBounds(latlngbounds);
  directionsService.route(
    {
      origin: startLatLang,
      destination: destLatLang,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: "DRIVING"
    },
    function(response, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        let route = response.routes[0];
        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {}
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}
