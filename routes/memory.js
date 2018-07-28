const express     = require('express');
const memoryRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');
const Memory       = require('../models/memory');

memoryRoutes.get('/:userName/:memory/memory', (req, res, next) => {
	const userId = req.session.currentUser._id;
	const userName = req.session.currentUser.firstname;
	const memoryId = req.params.memory;
	Memory.findById(memoryId)
	.exec((error, memory) => {
		const memName = memory.name;
		if (error) {next(error);}
		else {
			Place.find({ 'userId': userId })
			.exec((error, places) => {
				if (error) { next(error); } 
				else { res.render('user/memory', { places, userName, memoryId, memName });}
			});
		}
	});
});

module.exports = memoryRoutes;