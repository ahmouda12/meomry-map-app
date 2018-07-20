const express      = require('express');
const placeRoutes  = express.Router();
const multer       = require('multer');
const Place        = require('../models/place');
const upload       = multer({ dest: './public/uploads/' });

// New place
placeRoutes.get('/new-place', (req, res, next) => {
  res.render('place/new-place');
});

placeRoutes.post('/new-place', upload.single('photo'), (req, res, next) => {
	// Get params from POST
	const userId = req.session.currentUser._id;
  const location = {
		type: 'Point',
		coordinates: [req.body.longitude, req.body.latitude]
  };

  // Create a new place with location
  const newPlace = new Place({
		userId: 		 userId,
		name:        req.body.name,
		description: req.body.description,
		location:    location,
		path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
	});

  // Save the place to the database
  newPlace.save((error) => {
		if (error) { next(error); }
		else { res.redirect('/user');
		}
	});
});

// Edit place
placeRoutes.post('/:place_id', upload.single('photo'), (req, res, next) => {
	Place.findById(req.params.place_id, (error, place) => {
		if (error) { next(error); } 
		else {
			place.name         = req.body.name;
			place.description  = req.body.description;
			place.location 		 = { type: 'Point', coordinates: [req.body.longitude, req.body.latitude]};
			// place.path				 = `/uploads/${req.file.filename}`;
    	// place.originalName = req.file.originalname;
			place.save((error) => {
				if (error) { next(error); } 
				else { res.redirect('/user'); }
			});
		}
	});
});

placeRoutes.get('/:place_id/edit', (req, res, next) => {
	Place.findById(req.params.place_id, (error, place) => {
		// console.log(place)
		if (error) {
			next(error);
		} else {
			res.render('place/edit', { place });
		}
	});
});

// Delete place
placeRoutes.get('/:place_id/delete', (req, res, next) => {
	Place.remove({ _id: req.params.place_id }, (error, place) => {
		if (error) {
			next(error);
		} else {
			res.redirect('/user');
		}
	});
});

// Store place information in json
placeRoutes.get('/json', (req, res, next) => {
	const userId = req.session.currentUser._id;
	Place.find({ 'userId': userId })
	.exec((error, places) => {
		if (error) { next(error); } 
		else { res.status(200).json({ places });}
	});
});


module.exports = placeRoutes;