const express      = require('express');
const placeRoutes  = express.Router();
// const multer       = require('multer');
const uploadCloud  = require('../config/cloudinary.js');
const Place        = require('../models/place');
const Memory        = require('../models/memory');

// const upload       = multer({ dest: './public/uploads/' });

// New place
placeRoutes.get('/:id/new', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
	const memoryId = req.params.id;
  res.render('place/new', { userName, memoryId });
});

placeRoutes.get('/new', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
  res.render('place/new', { userName });
});

placeRoutes.post('/new', uploadCloud.single('photo'), (req, res, next) => {
	// Get params from POST
	const userId = req.session.currentUser._id;
  const location = {type: 'Point', coordinates: [req.body.longitude, req.body.latitude]};
	const {name, description, memoryId} = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newPlace = new Place({userId, memoryId, name, description, location, imgPath, imgName});
	const userName = req.session.currentUser.firstname;
	newPlace.save()
  .then(place => {
    res.redirect(`/${memoryId}/memory-dashboard`);
  })
  .catch(error => {
    console.log(error);
  });
});

// Edit place
placeRoutes.post('/:place_id', uploadCloud.single('photo'),(req, res, next) => {
	const userName = req.session.currentUser.firstname;
	Place.findById(req.params.place_id, (error, place) => {
		if (error) { next(); } 
		else {
			place.name         = req.body.name;
			place.description  = req.body.description;
			place.location 		 = { type: 'Point', coordinates: [req.body.longitude, req.body.latitude]};
			if(req.file){
			place.imgPath			 = req.file.url;
			place.imgName 		 = req.file.originalname;
			}
			place.save((error) => {
				const memoryId = place.memoryId;
				if (error) { next(error); } 
				else { res.redirect(`/${memoryId}/memory-dashboard`); }
			});
		}
	});
});

placeRoutes.get('/:place_id/edit', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
	Place.findById(req.params.place_id, (error, place) => {
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
	Place.findById(req.params.place_id, (error, place) => {
		const memoryId = place.memoryId;
		if (error) {next(error);} 
		else {
			Place.remove({ _id: req.params.place_id }, (error, place) => {
				if (error) {
					next(error);
				} else {res.redirect(`/${memoryId}/memory-dashboard`);}
			});
		}
	});
});

// Store place information in json
placeRoutes.get('/json/:memory', (req, res, next) => {
	const userId = req.session.currentUser._id;
	// const memoryId = req.params.id;
	Place.find({ 'memoryId': req.params.memory })
	.exec((error, places) => {
		if (error) { next(error);} 
		// places.forEach(place => {
		// 	Memory.findById(place.memoryId)
		// 	.then (foundMemory => {
		// 		console.log('mem id: ', foundMemory._id);
		// 		console.log('pl mem: ', place.memoryId);
		// 		// if((foundMemory._id).equals(place.memoryId)){
		// 		// 	console.log('mem: ', foundMemory)
		// 		// }
		// 	});
		// }); 
		else { 
			res.status(200).json({ places });
		}
	});
});

// placeRoutes.get('/:id/new', (req, res, next) => {
// 	const userName = req.session.currentUser.firstname;
// 	const memoryId = req.params.id;
//   res.render('place/new', { userName, memoryId });
// });

// Store place information in json
placeRoutes.get('/json', (req, res, next) => {
	const userId = req.session.currentUser._id;
	// const memoryId = req.params.id;
	Place.find({ 'userId': userId })
	.exec((error, places) => {
		if (error) { next(error);} 
		// places.forEach(place => {
		// 	Memory.findById(place.memoryId)
		// 	.then (foundMemory => {
		// 		console.log('mem id: ', foundMemory._id);
		// 		console.log('pl mem: ', place.memoryId);
		// 		// if((foundMemory._id).equals(place.memoryId)){
		// 		// 	console.log('mem: ', foundMemory)
		// 		// }
		// 	});
		// }); 
		else { 
			res.status(200).json({ places });
		}
	});
});


module.exports = placeRoutes;