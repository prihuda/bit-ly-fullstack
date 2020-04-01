const { Strategy } 	= require('passport-jwt');
const { User }      = require('../models');
const CONFIG        = require('../config/config');
const {to}          = require('../services/util.service');

module.exports = function(passport) {
	var opts = {};
	var getToken = function(req) {
		let token = null;
		if (req && req.session.token) {
			token = req.session.token.split(' ')[1];
		}
		return token;
	};
    
	opts.jwtFromRequest = getToken;
	opts.secretOrKey = CONFIG.jwt_encryption;

	passport.use(new Strategy(opts, async function(jwt_payload, done) {
		let err, user;
		
		[err, user] = await to(User.findByPk(jwt_payload.user_id));
		if (err) return done(err, false);
		
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	}));
	
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});
}