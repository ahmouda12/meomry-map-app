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
    axios.get("/json")
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
        lat: place.location.coordinates[0],
        lng: place.location.coordinates[1]
      };
      // Add markers to the map
      const pin = new L.marker([center.lat, center.lng]).addTo(map)
          .bindPopup(place.name);

        //   pin.on('click', function(e){
        //     map.setView([center.lat, center.lng], 13);
        // });
        
          markers.push(pin);
    });
    // Zoom to fit all markers
    if (markers.length > 1) {
      let group = L.featureGroup(markers).addTo(map);
      map.fitBounds(group.getBounds(), {padding: [50,50]});
      $("#zoomOut").on('click', function(e){
        const group = L.featureGroup(markers).addTo(map);
        map.fitBounds(group.getBounds(), {padding: [50,50]});
      });
    }
    else if (markers.length === 1) {
      lat = places[0].location.coordinates[0];
      lng = places[0].location.coordinates[1];
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
    lat: loc.coordinates[0],
    lng: loc.coordinates[1]
  };
  map.flyTo([center.lat, center.lng], 13);
}

// Click show images
$(document).ready( () => {
$("#divContainer img").on({
  mouseover () {
    $(this).css({
     'cursor': 'pointer',
     'border-color': 'red'
    });
  },
  mouseout () {
    $(this).css({
      'cursor': 'default',
      'border-color': 'grey'
     });
  },
  click () {
    let imageUrl = $(this).attr('src');
    $('#mainImage').fadeOut(300, function () {
      $(this).attr('src', imageUrl);
  }).fadeIn(300);
  }
});
});

// Slide show images
$(document).ready( () => {
  let imagesURLs = new Array();
  let intervalId;
  let btnStart = $("#btnStartSlideShow");
  let btnStop = $("#btnStopSlideShow");

  $("#divContainer img").each( function () {
    imagesURLs.push($(this).attr("src"));
  });

  function setImage() {
    let mainImageElement = $("#mainImage");
    let currentImageURL = mainImageElement.attr("src");
    let currentImageIndex = $.inArray(currentImageURL, imagesURLs);
    if(currentImageIndex == (imagesURLs.length -1)) {
      currentImageIndex = -1;
    }
    mainImageElement.attr("src", imagesURLs[currentImageIndex+1]);
  }

  btnStart.click(function () {
    IntervalId = setInterval(setImage, 3000);
    $(this).attr("disabled", "disabled");
    btnStop.removeAttr("disabled");
  });

  btnStop.click(function () {
    clearInterval (IntervalId);
    $(this).attr("disabled", "disabled");
    btnStart.removeAttr("disabled");
  }).attr("disabled", "disabled");

});

initmap();