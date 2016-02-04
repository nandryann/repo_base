var express = require('express');
var logger = require('winston');
var mongoose = require('mongoose');
var async = require('async');
var path = require('path');
var bodyParser = require('body-parser');

var AppConfig = require('./config/app.js').config;
var DbConfig = require('./config/db.js').config;

var env = process.env.NODE_ENV || 'dev';
var config = 'all';

var app = express();

app.set('port', AppConfig[config].port);
app.set('dbName', DbConfig[env].name);
app.use('/', express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async.series([
	function(cb) {
		app.listen(process.env.PORT || app.get('port'));
		logger.info('Autogest server listening on port ' + app.get('port'));
		return cb();
	},

	function(cb) {
		mongoose.connect('mongodb://localhost/' + app.get('dbName'));
		logger.info('Connected to Mongo database ' + app.get('dbName'));
		return cb();
	}
], function (err) {
	if (err) logger.error('error');

	AppConfig[config].routes.forEach(function(routeFile) {
		logger.info('Loading route ' + routeFile);
		var route = require('./routes/' + routeFile + '.js');
		return route(app, logger);
	});

	AppConfig[config].models.forEach(function(modelFile) {
		logger.info('Loading models ' + modelFile);
		return require('./models/' + modelFile + '.js');
	})
})
