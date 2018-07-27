let map;

function initmap() {
	// set up the map
  map = L.map( 'map', {
    attributionControl: false,
    center: [0, 0],
    minZoom: 2,
    zoom: 2
  });

  let markers = [];

	// create the tile layer with correct attribution
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
  }).addTo(map);

  function getPlace() {
    axios.get("/json/")
    .then( response => {
      placePlaces(response.data.places);
    })
    .catch(error => {
      next(error);
    });
  }
  getPlace();

// Get coordinates for markers
  function placePlaces(places){
    places.forEach((place) => {
      // console.log(place);
      const center = {
        lat: place.location.coordinates[1],
        lng: place.location.coordinates[0]
      };
      // Add markers to the map
      const pin = new L.marker([center.lat, center.lng]).addTo(map)
          .bindPopup(place.name);
          // .openPopup();
          markers.push(pin);
    });
    // Zoom to fit all markers
    if (markers.length > 1) {
      const group = L.featureGroup(markers).addTo(map);
      map.fitBounds(group.getBounds(), {padding: [50,50]});
      $("#zoomOut").on('click', function(e){
        const group = L.featureGroup(markers).addTo(map);
        map.fitBounds(group.getBounds(), {padding: [50,50]});
      });
    }
    else if (markers.length === 1) {
      lat = places[0].location.coordinates[1];
      lng = places[0].location.coordinates[0];
      map.setView(new L.LatLng(lat, lng), 4);
      $("#zoomOut").on('click', function(e){
        map.setView(new L.LatLng(lat, lng), 4);
      });
    }
  }
}

// Fly to markers
function zoomIn(loc){
  const center = {
    lat: loc.coordinates[1],
    lng: loc.coordinates[0]
  };
  map.flyTo([center.lat, center.lng], 13);
}

initmap();