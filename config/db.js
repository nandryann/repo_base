exports.config = {
	dev : {
		name: 'projet_dev',
		port: 27017,
		host: 'localhost',
		user:  null,
		password: null
	},

	staging : {
		name: 'projet_staging',
		port: 51853,
		host: 'ds051853.mongolab.com',
		user:  'exemple',
		password: '123456'
	},

	production : {
		name: 'projet_production',
		port: 51853,
		host: 'ds051853.mongolab.com',
		user:  'exemple',
		password: '123456'
	}
};
