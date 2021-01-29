const type = document.getElementById("type");
const matchList = document.getElementById("match-list");
let routeHandler = "";
let markersArray = [];
let infoWindows = [];
let currentLatLong;
let loggedInUserLocation;

let directionsService;
let directionsRenderer;
let geocoder;
const MARKER_ICON =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
let latlngbounds;
let allLatLng = [];

/**
 * @description This function is responsible for searching the database with the type of e
 * @param {String} type Type of service provider
 */
const searchCategories = async type => {
  // Get all the search category from server
  const res = await fetch("/search-category");
  const categories = await res.json();
  // Filters the fetched categories by the inputted type
  let match = categories.filter(cat => {
    //   gi makes it to match regardless of case sensetive
    const regEx = new RegExp(`^${type}`, "gi");
    return cat.type.match(regEx);
  });

  //   If nothing is init dont give all json blob
  if (type.length === 0) {
    match = [];
    matchList.innerHTML = "<p class='mt-3 ml-3'>Sorry no results found!</p>";
  }

  outputToThePage(match);
};

/**
 * @description Output to the page taking all the match data
 * @param {Array} match matched value
 */
const outputToThePage = match => {
  if (match.length > 0) {
    const html = match
      .map(
        cat => `
        <div class="card card-body mb-1 stylish-color-dark" style="cursor: pointer;" >
            <h4 class="text-primary" id="${cat.type}" onclick="showLists('${cat.type}')">${cat.type}</h4>
            <small>Demand:${cat.demand}</small>
        </div>
        `
      )
      .join("");
    matchList.innerHTML = html;
  }
};

/**
 * @description Invoke server's route and get all the profiles using input category name
 * @param {String} categoryName Category Name examples: Cleaners and Painters
 */
const showLists = async categoryName => {
  // Hide the default img
  document.getElementById("default-img").style.display = "none";
  let toggleMap = document.getElementById("togglemap").checked;
  // Post to /profile-search route passing category name that returns all the matched profiles
  $.ajax("/profile-search", {
    type: "POST",
    data: { type: categoryName },
    success: (data, status, xhr) => {
      document.getElementById("default-img").style.display = "none";
      if (toggleMap) {
        deleteMarkers();
        // Remove all the previous direction routes
        if (directionsRenderer != null || directionsRenderer != undefined)
          directionsRenderer.setDirections({ routes: [] });

        showDataInMap(data);
      } else {
        if (data.length === 0) {
          data = [];
          document.getElementById("list-of-profiles").innerHTML =
            "<p class='mt-3 ml-3'>Sorry no results found!</p>";
        }
        // Output those profile
        outputProfileList(data);
      }
    },
    error: () => {}
  });
};

/**
 * @description Output to the page taking all the match data i.e list of profiles
 * @param {Array} list List of the profile of service providers
 */
const outputProfileList = list => {
  let toggleMap = document.getElementById("togglemap").checked;
  // If map checkbox is not clicked, show the list of profiles
  if (!toggleMap) $("#list-of-profiles").show();
  if (list.length > 0) {
    const html = list
      .map(
        profile => `
        <div class="profile-list-container" 
        id="profile-list-container">
          <div class="each-profile card card-body mb-3" style="cursor: pointer;"  onclick="clickedProfileHandler('${
            profile.handle
          }')" >
              <img src=${
                profile.profileImg ? profile.profileImg : "/images/default.png"
              }>
              <div style='margin-left: 2rem;'>
              <h4 class="text-primary">${profile.name}</h4>
              <p class="text-primary">Call: ${profile.phone}</p>
              <p class="text-primary">Email: ${profile.email}</p>
              <p class="text-primary">About: ${profile.description}</p><br>
              <small>Located At: ${profile.address}</small>
              
              </div>    
          </div>
        </div>
        `
      )
      .join("");
    document.getElementById("list-of-profiles").innerHTML = html;
  }
  // Checks in whether the user is logged in or not
  fetch("/loggedin", {
    method: "POST",
    headers: {
      "Conent-Type": "application/json"
    },
    body: "Check"
  })
    .then(res => res.json())
    .then(data => {
      let divs = document.getElementsByClassName("profile-list-container");

      // If not logged in don't allow them to go to profile
      if (!data.loggedIn) {
        for (let i = 0; i < divs.length; i++) {
          //
          divs[i].addEventListener("click", () => showLoginPopup());
        }
      } else {
        for (let i = 0; i < divs.length; i++) {
          divs[i].addEventListener("click", () => goToProfile());
        }
      }
    })
    .catch(err => console.log(err));
};

/**
 * @description Responsible for showing estimated time in maps info Window pop up
 * @param {String} lat Latitude
 * @param {String} lng Longitude
 */
const showTime = (lat, lng) => {
  // Parse the Lat and Lng to Float
  let destLatLang = { lat: parseFloat(lat), lng: parseFloat(lng) };

  // Remove all the previous direction routes
  directionsRenderer.setDirections({ routes: [] });

  // Set the direction display to the searchmap
  directionsRenderer.setMap(window.searchmap);

  // Calculates and displays the required route
  calculateAndDisplayRoute(
    directionsService,
    directionsRenderer,
    currentLatLong,
    destLatLang
  );
};
// Attach input event to the type text search form and invoke searchCategories passing passing its value
type.addEventListener("input", () => searchCategories(type.value));

/**
 * @description Responsible to show the popup if the user is not logges in
 */
const showLoginPopup = () => {
  // Using sweet alert library
  // https://sweetalert2.github.io/
  Swal.fire({
    title: "Stop!",
    text: "Only the logged in memeber can access this.",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f7500b",
    cancelButtonColor: "#333333",
    confirmButtonText: "Login",
    cancelButtonText: "Register"
  }).then(result => {
    if (result.value === true) {
      // Redirect to login page
      location.href = "/login";
    } else if (result.dismiss === "cancel") {
      // Redirect to signup page
      location.href = "/signup";
    }
  });
};

// Redirects to the specific profile of service provider
const goToProfile = () => {
  location.href = `user/${routeHandler}/profile`;
};

/**
 * @description Responsible for checking whether the user is logged in or not
 * @param {String} handler Unique handler of the provider
 */
const clickedProfileHandler = handler => {
  // Store reference to the handler param
  routeHandler = handler;
  // Checks whether the user is logged in or not
  fetch("/loggedin", {
    method: "POST",
    headers: {
      "Conent-Type": "application/json"
    },
    body: "Check"
  })
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        showLoginPopup();
      } else {
        goToProfile();
      }
    })
    .catch(err => console.log(err));
};

let map = false;
// Responsible for displaying the map in click of toggleMap checkbox
const showMap = () => {
  let search = document.getElementById("type").value;
  if (!map) {
    // Show map
    document.getElementById("searchmap").style.height = "100%";
    // Hide others
    $("#default-img").hide();
    $("#list-of-profiles").hide();
  } else {
    // hide map
    document.getElementById("searchmap").style.height = "0%";
    //  Show others
    if (search) {
      $("#list-of-profiles").show();
    } else {
      $("#default-img").show();
    }
  }

  map = !map;
};

/**
 * @description Shows the marker with providers location
 * @param {String} data Contains total number of searched profiles of providers
 */
const showDataInMap = data => {
  data.forEach(profile => {
    addMarker(profile);
    showMarkers();
  });

  // Checks whether the user is logged in or not
  fetch("/loggedin", {
    method: "POST",
    headers: {
      "Conent-Type": "application/json"
    },
    body: "Check"
  })
    .then(res => res.json())
    .then(data => {
      let divs = document.getElementsByClassName("profile-list-container");

      if (!data.loggedIn) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].addEventListener("click", () => showLoginPopup(), false);
        }
      } else {
        for (let i = 0; i < divs.length; i++) {
          divs[i].addEventListener("click", () => goToProfile(), false);
        }
      }
    })
    .catch(err => console.log(err));
};

// Returns random location data (for testing)
const getRandomPoints = count =>
  generateRandomPoints({ lat: -33.8821865664, lng: 151.20079404 }, 1000, count);

// Responsible to add Marker to the map
const addMarker = data => {
  let map = window.searchmap;
  let address;

  // Parse the address text into lat and lng using geocoder api
  geocoder.geocode({ address: data.address }, (results, status) => {
    if (status == "OK") {
      address = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      };
      allLatLng.push(new google.maps.LatLng(address.lat, address.lng));

      let marker = new google.maps.Marker({
        position: address,
        map: map,
        id: address.lng.toFixed(1)
      });
      let currLoc = address;
      let infoWindow = new google.maps.InfoWindow({
        content: `
    <div class="profile-list-container"
        id="profile-list-container" style="margin:0; padding: 0;">
          <div class="each-profile" style="cursor: pointer;"  onclick="clickedProfileHandler('${
            data.handle
          }')" > 
              <div style='margin-left: 2rem;'>
              <h4 class="text-primary">${data.name}</h4>
              <p class="text-primary">Address: ${data.address}</p>
              </div>
          </div>
        </div>
         <button class='btn btn-success' id="${currLoc.lng.toFixed(
           1
         )}" onclick='showTime("${currLoc.lat}", "${
          currLoc.lng
        }")'>Show Est. Time</button>
      <div id="time" style="display:none;">
        <i class="fas fa-clock fa-lg mr-1"></i> <span id='distance-time' class="lead"></span> <br>
       <i class="fas fa-car fa-lg mr-1"></i>  <span id='distance' class="lead"></span>
      </div>

    `
      });

      marker.addListener("click", () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
      });
      // marker.setAttribute("id", `${currLoc.lng.toFixed(2)}`);
      infoWindows.push(infoWindow);
      markersArray.push(marker);

      // loop through the all locations and extend the map accordingly
      for (var i = 0; i < allLatLng.length; i++) {
        latlngbounds.extend(allLatLng[i]);
      }
      window.searchmap.fitBounds(latlngbounds);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};

// Closes all open info windows
function closeAllInfoWindows() {
  for (var i = 0; i < infoWindows.length; i++) {
    infoWindows[i].close();
  }
}

// Initial the map
async function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true
  });
  latlngbounds = new google.maps.LatLngBounds();
  geocoder = new google.maps.Geocoder();

  // Get Cuurent User Location
  const userID = document.getElementById("userId").value;
  let userLocation;

  // Get location of logged in user
  fetch(`/user/getLocation/${userID}`)
    .then(res => res.json())
    .then(results => {
      loggedInUserLocation = results.address;
      if (loggedInUserLocation != null || loggedInUserLocation != undefined) {
        userLocation = loggedInUserLocation;
      } else {
        userLocation = "UTS Faculty of Engineering and IT, Ultimo NSW";
      }
      // Parse the location of logged in user
      geocoder.geocode({ address: userLocation }, (results, status) => {
        if (status == "OK") {
          currentLatLong = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };

          localStorage.setItem(
            "currentLocation",
            JSON.stringify(currentLatLong)
          );
          // localStorage.setItem("currentLocation", currentLatLong);
          window.searchmap = new google.maps.Map(
            document.getElementById("searchmap"),
            {
              zoom: 16,
              center: currentLatLong
            }
          );

          let marker = new google.maps.Marker({
            position: currentLatLong,
            animation: google.maps.Animation.DROP,
            icon: "https://img.icons8.com/nolan/64/000000/map-pin.png",
            map: window.searchmap
          });
          marker.addListener("click", () => toggleBounce(marker));

          let infoWindow = new google.maps.InfoWindow({
            content: "<h3>This is your current location.</h3>"
          });

          marker.addListener("click", () => {
            infoWindow.open(window.searchmap, marker);
          });
          allLatLng.push(
            new google.maps.LatLng(currentLatLong.lat, currentLatLong.lng)
          );
        }
      });
    });
}

// Animate the current marker
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// Calculate the time and distance and show routes
function calculateAndDisplayRoute(
  directionsService,
  directionsRenderer,
  currentLatLong,
  destinationLatLang
) {
  let waypoints = [];
  let totalDistance = 0;
  let totalTime = 0;

  let startLatLang = new google.maps.LatLng(currentLatLong);
  let destLatLang = new google.maps.LatLng(destinationLatLang);

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
        let legs = route.legs;

        // For each route, add toal ditance
        for (let i = 0; i < legs.length; i++) {
          totalDistance = totalDistance + legs[i].distance.value;
          totalTime = totalTime + legs[i].duration.value;
        }

        totalTime = (totalTime / 60).toFixed(2) + " mins";
        totalDistance = (totalDistance / 1000).toFixed(2) + " km";
        // Append Distance and Time
        document.getElementById("time").style.display = "block";
        document.getElementById("distance-time").innerHTML = totalTime;
        document.getElementById("distance").innerHTML = totalDistance;
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

// Set all markers to the map
const setMapOnAll = map => {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
};

// Clear all markers in the search map
const clearMarkers = () => {
  setMapOnAll(null);
};

// Shows all the maps in search map
const showMarkers = () => {
  setMapOnAll(window.searchmap);
};

// Delete all the markers in search map
const deleteMarkers = () => {
  clearMarkers();
  markersArray = [];
};

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray = new Array();
  }
}

// Gets the current Location of the user
const setLocation = userLocation => {
  userLocation = "1A Mortan Street, Parramatta, Sydney";
  geocoder.geocode({ address: userLocation }, (results, status) => {
    if (status == "OK") {
      currentLatLong = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      };
      console.log("Current", currentLatLong);
    }
  });
};
