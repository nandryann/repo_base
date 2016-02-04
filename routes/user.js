var mongoose = require('mongoose');
var User = require('../models/user').User;
var crypto = require('crypto');

module.exports = function (app, logger) {

	var createUser = function createUser (req, res) {
		req.body.password = crypto.createHash('md5').update(req.body.password).digest("hex");
		return User.create(req.body, function(err, created) {
			if (err) logger.error(err);
			res.json({data: created}, 201);
			return logger.info('User added successfuly');
		})
	};

	var findOneUser = function findOneUser (req, res) {
		var username = req.params.username;
		var password = req.params.password;
		return User.findOne({username : username, password: password}, function (err, oneUser) {
			if (err) logger.error(err);
			logger.info('Finding one user success');
			res.setHeader('Content-Type', 'application/json');
			return res.send(JSON.stringify({data: oneUser}, null, 3));
		})
	}

	var getUsers = function getUsers (req, res) {
		return User.find({}, function(err, list) {
			if (err) logger.error(err);
			logger.info('Loading the data in the User collection');
			res.setHeader('Content-Type', 'application/json');
			return res.send(JSON.stringify({ data: list }, null, 3));
		})
	};

	var updateUser = function updateUser (req, res) {
		var id = req.params.id;
		return User.update({_id: id}, { $set: req.body }, function(err, updated) {
			if (err) logger.error(err);
			res.json({data: updated}, 201);
			return logger.info('User updated successfuly');
		})
	};

	var deleteUser = function deleteUser (req, res) {
		var id = req.params.id;
		return User.remove({_id: id}, function(err, deleted) {
			if (err) logger.error(err);
			res.json({data: deleted}, 201);
			return logger.info('User deleted successfuly');
		})
	};

	app.get('/users', getUsers);
	app.get('/user/:username/:password', findOneUser);
	app.post('/user', createUser);
	app.put('/user/:id', updateUser);
	app.delete('/user/:id', deleteUser);
}
