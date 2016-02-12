/**
 * Dependencies
 */
var express = require('express');
var logger = require('winston');
var mongoose = require('mongoose');
var async = require('async');
var path = require('path');
var bodyParser = require('body-parser');

/**
 * Internal Dependencies
 */
var AppConfig = require('./config/app.js').config;
var DbConfig = require('./config/db.js').config;
var Utils = require('./modules/utils.js');

/**
 * Variables
 */
var isInitialized = false;

/**
 * Create application
 */
var app = express();

/**
 * Configure
 */
var env = process.env.NODE_ENV || 'dev';
var config = 'all';

app.set('port', AppConfig[config].port);
app.set('dbName', DbConfig[env].name);
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Launch
 */
async.series([
	function(cb) {
		var config = DbConfig[env];
		var args = [Utils.buildMongoPath(config)];
		if (config.options) args.push(config.options);
		args.push(function(err) {
      if (err) return cb(err);
      logger.info('Connected to Mongo database', config.name);
      return cb();
    });
		return mongoose.connect.apply(mongoose, args);
	},

	function(cb) {
		app.listen(process.env.PORT || app.get('port'));
		logger.info('Server listening on port ' + app.get('port'));
		return cb();
	}
], function (err) {
	if (err) logger.error('error');

	/**
   * Declare routes
   */
	AppConfig[config].routes.forEach(function(routeFile) {
		logger.info('Loading route ' + routeFile);
		var route = require('./routes/' + routeFile + '.js');
		return route(app, logger);
	});

	/**
   * Build models
   */
	AppConfig[config].models.forEach(function(modelFile) {
		logger.info('Loading models ' + modelFile);
		return require('./models/' + modelFile + '.js');
	})

})
