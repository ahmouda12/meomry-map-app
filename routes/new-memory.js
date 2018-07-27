const express     = require('express');
const newMemoryRoutes  = express.Router();
const User        = require('../models/user');
const Place       = require('../models/place');
const Memory      = require('../models/memory');


newMemoryRoutes.get('/new-memory', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
  res.render('user/new-memory', { userName });
});

newMemoryRoutes.post('/new-memory', (req, res, next) => {
	// Get params from POST
	const userId = req.session.currentUser._id;
	const {name} = req.body;
	const newMemory = new Memory({userId, name});
	const userName = req.session.currentUser.firstname;
	newMemory.save()
  .then(memory => {
    res.redirect(`/${userName}/dashboard`);
  })
  .catch(error => {
    console.log(error);
  });
});

newMemoryRoutes.get('/:id/memory-dashboard', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
	const memoryId = req.params.id;
	Memory.findById(memoryId)
	.exec((error, memory) => {
		const memName = memory.name;
		if (error) {next(error);}
		else {
			Place.find({'memoryId': memoryId })
			.exec((error, places) => {
				if (error) { next(); } 
				else { res.render('user/memory-dashboard', { places, userName, memoryId, memName });}
			});
		}
	});
});

// Delete memory
newMemoryRoutes.get('/:id/delete-memory', (req, res, next) => {
	const userName = req.session.currentUser.firstname;
	Memory.remove({ _id: req.params.id }, (error, memory) => {
		if (error) {
			next(error);
		} else {
			Place.remove({ memoryId: req.params.id }, (error, place) => {
				if (error) { next(error); }
			else {res.redirect(`/${userName}/dashboard`);}
		});}
	});
});

module.exports = newMemoryRoutes;