"use strict";

const express           = require('express');
const uRoutes           = express.Router();
const methodOverride    = require('method-override');
const uuid 				= require('uuid/v4');
const { Url, Visitor }	= require('../models');
const { to, ReE, ReS }  = require('../services/util.service');

// Short-link redirection
uRoutes.get("/:shortURL", async (req, res) => {
	let err, url;
	
	[err, url] = await to(Url.findOne({
		where: {
			short_url: req.params.shortURL
		}
	}));
	if (err) {
		req.flash('danger', "That short URL couldn't be found.");
		return res.redirect("/");
	}
	
	let target = url['url'];
	
	// prepend '//' if the url address is a relative path
	if (target.indexOf('http://') == -1 && 
			target.indexOf('https://') == -1) {
				target = '//' + target;
	}
	
	let ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 
					  req.connection.remoteAddress || 
					  req.socket.remoteAddress || 
					  req.connection.socket.remoteAddress || '';	
	let data = {
		uuid: uuid(),
		UrlId: url['id'],
		ip_address: ip,
		referrer_url: req.headers.referrer || req.headers.referer
	};
	
	Visitor.create(data)
		.catch(error => console.log('Error:', error));
	
	return res.redirect(target);
});
	
module.exports = uRoutes;
