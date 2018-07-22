const express     = require('express');
const userRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');


userRoutes.get('/:userName/dashboard', (req, res, next) => {
	const userId = req.session.currentUser._id;
	const userName = req.session.currentUser.firstname;
	Place.find({ 'userId': userId })
	.exec((error, places) => {
		if (error) { next(error); } 
		else { res.render('user/dashboard', { places, userName });}
	});
});

module.exports = userRoutes;