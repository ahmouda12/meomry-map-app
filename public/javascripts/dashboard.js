function initmap() {
	// set up the map
  let map = L.map( 'map', {
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
    axios.get("https://meomry-map-app.herokuapp.com/json")
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
          .bindPopup(place.name);
          // .openPopup();
          // pin.url = 'www.google.com';
          // pin.on('click', function(){
          //   window.location = (this.url);
          //   });
          $('.zoom').on('click', function(e){
            map.setView([center.lat, center.lng], 13);
        });
        // console.log([center.lat, center.lng])
        // pin.on('click', function(){
        //   map.flyTo([52, -1], 12);
        // });
          markers.push(pin);
    });
    // Zoom to fit all markers
    if (markers.length > 1) {
      let group = L.featureGroup(markers).addTo(map);
      map.fitBounds(group.getBounds(), {padding: [50,50]});
    }
    else if (markers.length === 1) {
      lat = places[0].location.coordinates[1];
      lng = places[0].location.coordinates[0];
      map.setView(new L.LatLng(lat, lng), 4);
    }
  }

  // $('.zoom').on('click', function(){
  //   // parse lat and lng from the divs data attribute
  //   var latlng = $(this).data().point.split(',');
  //   console.log(latlng)
  //   var lat = latlng[0];
  //   var lng = latlng[1];
  //   var zoom = 10;
  
  //   // set the view
  //   map.setView([lat, lng], zoom);
  // })

  // $('.zoom').on('click', function(){
  //   map.flyTo([52, -1], 12);
  // });

//   $('.zoom').on('click', function(e){
//     map.setView([center.lat, center.lng], 13);
// });

}

initmap();