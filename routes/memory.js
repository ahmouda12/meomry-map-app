const express     = require('express');
const memoryRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');

// memoryRoutes.get('/user', (req, res, next) => {
//   res.render('user/user-page');
// });

memoryRoutes.get('/memory', (req, res, next) => {
  const userId = req.session.currentUser._id;
	Place.find({ 'userId': userId })
	.exec((error, places) => {
		if (error) { next(error); } 
		else { res.render('user/memory', { places });}
	});
});

module.exports = memoryRoutes;