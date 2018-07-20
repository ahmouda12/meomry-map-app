const express     = require('express');
const userRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');

// userRoutes.get('/user', (req, res, next) => {
//   res.render('user/user-page');
// });

userRoutes.get('/user', (req, res, next) => {
	const userId = req.session.currentUser._id;
	Place.find({ 'userId': userId })
	.exec((error, places) => {
		if (error) { next(error); } 
		else { res.render('user/user-page', { places });}
		res.render('user/user-page');
	});
});

module.exports = userRoutes;