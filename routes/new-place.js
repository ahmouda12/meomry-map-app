const express      = require('express');
const placeRoutes  = express.Router();
const multer       = require('multer');
const Place        = require('../models/place');
const upload       = multer({ dest: './public/uploads/' });

placeRoutes.get('/new-place', (req, res, next) => {
  res.render('places/new-place');
});

// placeRoutes.get('/new-place', (req, res, next) => {
// 	Place.find((error, places) => {
//     // console.log(places);
// 		if (error) { next(error); } 
// 		else { res.render('places/new-place', { places });}
// 	});
// });

placeRoutes.post('/new-place', upload.single('photo'), (req, res, next) => {
  // Get Params from POST
  let location = {
		type: 'Point',
		coordinates: [req.body.longitude, req.body.latitude]
  };

  // Create a new Place with location
  const newPlace = new Place({
		name:        req.body.name,
		description: req.body.description,
		location:    location,
		path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
	});

  // Save the place to the Database
  newPlace.save((error) => {
		if (error) { next(error); }
		else { res.redirect('/user');
		}
	});
});

placeRoutes.get('/json', (req, res, next) => {
	Place.find((error, places) => {
		if (error) { next(error); } 
		else { res.status(200).json({ places });}
	});
});

module.exports = placeRoutes;