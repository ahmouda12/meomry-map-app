const express     = require('express');
const userRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');

// userRoutes.get('/user', (req, res, next) => {
//   res.render('user/user-page');
// });

userRoutes.get('/user', (req, res, next) => {
	Place.find((error, places) => {
    // console.log(places);
		if (error) { next(error); } 
		else { res.render('user/user-page', { places });}
	});
});


module.exports = userRoutes;