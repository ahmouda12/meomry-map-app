function initmap() {
	// set up the map
  let map = L.map( 'map', {
    attributionControl: false,
    center: [0, 0],
    minZoom: 2,
    zoom: 4
  });

  let markers = [];

	// create the tile layer with correct attribution
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
  }).addTo(map);

  // Show lat & long onclick
  map.on('click', function(e) {        
    let popLocation= e.latlng;
    let lat = e.latlng.lat.toFixed(2);
    let lng = e.latlng.lng.toFixed(2);
    let popup = L.popup()
    .setLatLng(popLocation)
    .setContent("lat: " + lat + ", lng: " + lng)
    .openOn(map);      
  });

  const lat = parseFloat(document.getElementById('latitude').value);
	const lng = parseFloat(document.getElementById('longitude').value);

  const center = {
    lat: lat,
    lng: lng
  };

  // Add the marker to the map
  const pin = new L.marker([center.lat, center.lng]).addTo(map);

  markers.push(pin);

  // Zoom to the marker
  let group = L.featureGroup(markers).addTo(map);
  map.fitBounds(group.getBounds());
  map.setView(new L.LatLng(lat, lng), 4);

}

initmap();