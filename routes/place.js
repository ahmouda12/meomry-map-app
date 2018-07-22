const express      = require('express');
const placeRoutes  = express.Router();
// const multer       = require('multer');
const uploadCloud  = require('../config/cloudinary.js');
const Place        = require('../models/place');
// const upload       = multer({ dest: './public/uploads/' });

// New place
placeRoutes.get('/new', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
  res.render('place/new', { userName });
});

placeRoutes.post('/new', uploadCloud.single('photo'), (req, res, next) => {
	// Get params from POST
	const userId = req.session.currentUser._id;
  const location = {type: 'Point', coordinates: [req.body.latitude, req.body.longitude]};
	const {name, description} = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newPlace = new Place({userId, name, description, location, imgPath, imgName});

	const userName = req.session.currentUser.firstname;
	newPlace.save()
  .then(place => {
    res.redirect(`/${userName}/dashboard`);
  })
  .catch(error => {
    console.log(error);
  });
});

// Edit place
placeRoutes.post('/:place_id', uploadCloud.single('photo'),(req, res, next) => {
	const userName = req.session.currentUser.firstname;
	Place.findById(req.params.place_id, (error, place) => {
		if (error) { next(error); } 
		else {
			place.name         = req.body.name;
			place.description  = req.body.description;
			place.location 		 = { type: 'Point', coordinates: [req.body.latitude, req.body.longitude]};
			place.imgPath			 = req.file.url;
    	place.imgName 		 = req.file.originalname;
			place.save((error) => {
				if (error) { next(error); } 
				else { res.redirect(`/${userName}/dashboard`); }
			});
		}
	});
});

placeRoutes.get('/:place_id/edit', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
	Place.findById(req.params.place_id, (error, place) => {
		// console.log(place)
		if (error) {
			next(error);
		} else {
			res.render('place/edit', { place, userName });
		}
	});
});

// Delete place
placeRoutes.get('/:place_id/delete', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
	Place.remove({ _id: req.params.place_id }, (error, place) => {
		if (error) {
			next(error);
		} else {
			res.redirect(`/${userName}/dashboard`);
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