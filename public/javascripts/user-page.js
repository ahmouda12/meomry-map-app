function initmap() {
	// set up the map
  let map = L.map( 'map', {
    attributionControl: false,
    center: [38, -98],
    minZoom: 2,
    zoom: 4
  });

  let markers = [];

	// create the tile layer with correct attribution
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
  }).addTo(map);

  function getPlace() {
    axios.get("http://localhost:3000/json")
    .then( response => {
      placePlaces(response.data.places);
    })
    .catch(error => {
      next(error);
    });
  }
  getPlace();

  function placePlaces(places){
    places.forEach((place) => {
      // console.log(place);
      const center = {
        lat: place.location.coordinates[1],
        lng: place.location.coordinates[0]
      };
      // Add markers to the map
      const pin = new L.marker([center.lat, center.lng]).addTo(map)
          .bindPopup(place.path);
          // .openPopup();
          markers.push(pin);
    });
    // Zoom to fit all markers
    let group = L.featureGroup(markers).addTo(map);
    map.fitBounds(group.getBounds());
  }      
}

initmap();