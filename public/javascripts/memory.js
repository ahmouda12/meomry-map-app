let map;

function initmap() {
	// Set up the map
  map = L.map( 'map', {
    attributionControl: false,
    center: [0, 0],
    minZoom: 2,
    zoom: 2
  });

  // let name = -1;
  // let zoomTo = -1;
  let markers = [];
  let imgUrls = [];
  let imgNames = [];
  let locations = [];
  let placeNames = [];
 
	// Create the tile layer with correct attribution
	L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
  }).addTo(map);

  // Get data from json file
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
      const imgUrl = place.imgPath;
      const imgName = place.imgName;
      const placeName = place.name;
      const center = {
        lat: place.location.coordinates[1],
        lng: place.location.coordinates[0]
      };

      // Add markers to the map
      const pin = new L.marker([center.lat, center.lng]).addTo(map)
                .bindPopup(place.name);

      // Push to arrays
      markers.push(pin);
      imgUrls.push(imgUrl);
      imgNames.push(imgName);
      locations.push(center);
      placeNames.push(placeName);
    });

    // Zoom to fit all markers
    if (markers.length > 1) {
      let group = L.featureGroup(markers).addTo(map);
      map.fitBounds(group.getBounds(), {padding: [50,50]});
      $("#zoomOut").on('click', function(e){
        const group = L.featureGroup(markers).addTo(map);
        map.fitBounds(group.getBounds(), {padding: [50,50]});
        map.closePopup();        
      });
    }
    else if (markers.length === 1) {
      lat = places[0].location.coordinates[1];
      lng = places[0].location.coordinates[0];
      map.setView(new L.LatLng(lat, lng), 4);
      $("#zoomOut").on('click', function(e){
        map.setView(new L.LatLng(lat, lng), 4);
        map.closePopup();
      });
    }

    // Manipulate images and locations
    // // Click on images
    // $("#mainImage").click(function () {
    //   let mainImageElement = $("#mainImage");
    //   // Replace image's url
    //   let currentImageURL = mainImageElement.attr("src");
    //   let currentImageIndex = $.inArray(currentImageURL, imgUrls);
    //   if(currentImageIndex == (imgUrls.length -1)) {
    //     currentImageIndex = -1;
    //   }
    //   mainImageElement.attr("src", imgUrls[currentImageIndex+1]);
    //   // Replace image's alt
    //   let currentImageName = mainImageElement.attr("alt");
    //   let currentImageNameIndex = $.inArray(currentImageName, imgNames);
    //   if(currentImageNameIndex == (imgNames.length -1)) {
    //     currentImageNameIndex = -1;
    //   }
    //   mainImageElement.attr("alt", imgNames[currentImageNameIndex+1]);
    //   // Zoom to image's location
    //   zoomTo = (zoomTo+1) % locations.length;   
    //   map.flyTo([locations[zoomTo].lat, locations[zoomTo].lng], 13);
    //   // Popup place's name when zoom
    //   name = (name+1) % placeNames.length; 
    //   markers[name].openPopup();
    // });

    let curimg = -1;
    let numimg = imgUrls.length;
    // Next arrow
    $("#arrowPrev").click(function () {
      let mainImageElement = $("#mainImage");
      if (curimg>0) {
        mainImageElement.attr("src", imgUrls[curimg-1]);
        mainImageElement.attr("alt", imgNames[curimg-1]);
        map.flyTo([locations[curimg-1].lat, locations[curimg-1].lng], 10);
        markers[curimg-1].openPopup();
        curimg = curimg - 1;
      } else{
        //  alert("This is the first image");
        }
    });

    // Previous arrow
    $("#arrowNext").click(function () {
      let mainImageElement = $("#mainImage");
       if(curimg < numimg-1){        
        mainImageElement.attr("src", imgUrls[curimg+1]);
        mainImageElement.attr("alt", imgNames[curimg+1]);
        map.flyTo([locations[curimg+1].lat, locations[curimg+1].lng], 10);
        markers[curimg+1].openPopup();
        curimg = curimg + 1;
       } else{
          // alert("This is the last image");
         }
    });
  }
}

// // Fly to markers
// function zoomIn(loc){
//   const center = {
//     lat: loc.coordinates[1],
//     lng: loc.coordinates[0]
//   };
//   map.flyTo([center.lat, center.lng], 13);
// }

// // Click show images
// $(document).ready( () => {
//   $("#divContainer img").on({
//     mouseover () {
//       $(this).css({
//       'cursor': 'pointer',
//       'border-color': 'red'
//       });
//     },
//     mouseout () {
//       $(this).css({
//         'cursor': 'default',
//         'border-color': 'grey'
//       });
//     },
//     click () {
//       let imageUrl = $(this).attr('src');
//       $('#mainImage').fadeOut(300, function () {
//         $(this).attr('src', imageUrl);
//     }).fadeIn(300);
//     }
//   });
// });

// // Slide show images
// $(document).ready( () => {
//   let imagesURLs = new Array();
//   let intervalId;
//   let btnStart = $("#btnStartSlideShow");
//   let btnStop = $("#btnStopSlideShow");

//   $("#divContainer img").each( function () {
//     imagesURLs.push($(this).attr("src"));
//   });

//   function setImage() {
//     let mainImageElement = $("#mainImage");
//     let currentImageURL = mainImageElement.attr("src");
//     let currentImageIndex = $.inArray(currentImageURL, imagesURLs);
//     if(currentImageIndex == (imagesURLs.length -1)) {
//       currentImageIndex = -1;
//     }
//     mainImageElement.attr("src", imagesURLs[currentImageIndex+1]);
//   }

//   btnStart.click(function () {
//     IntervalId = setInterval(setImage, 3000);
//     $(this).attr("disabled", "disabled");
//     btnStop.removeAttr("disabled");
//   });

//   btnStop.click(function () {
//     clearInterval (IntervalId);
//     $(this).attr("disabled", "disabled");
//     btnStart.removeAttr("disabled");
//   }).attr("disabled", "disabled");

// });

initmap();