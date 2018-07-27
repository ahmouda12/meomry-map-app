const express     = require('express');
const userRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');
const Memory      = require('../models/memory');


userRoutes.get('/:userName/dashboard', (req, res, next) => {
	const userId = req.session.currentUser._id;
	const userName = req.session.currentUser.firstname;
	Place.find({ 'userId': userId })
	.exec((error, places) => {
		if (error) { next(error); } 
		else { 
			Memory.find({ 'userId': userId })
			.exec((error, memories) => {
				if (error) { next(error); } 
				else { res.render('user/dashboard', { places, memories, userName });}
			});
		}
	});
});

module.exports = userRoutes;