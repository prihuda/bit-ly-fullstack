"use strict";

const express           = require('express');
const urlRoutes         = express.Router();
const methodOverride    = require('method-override')
const { Url, Visitor }  = require('../models');
const authService       = require('../services/auth.service');
const { ReE, ReS }      = require('../services/util.service');
const {to}              = require('await-to-js');
const randomizer        = require("../lib/randomizer");
const passport      	  = require('passport');

require('./../middleware/passport')(passport)

var authenticate = function(req, res, next) {
	passport.authenticate('jwt', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
			req.session = null;
			return res.status(401).end();
		}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return next();
    });
  })(req, res, next);
};

urlRoutes.get("/", authenticate, async (req, res) => {
	let user_id = req.session.user_id;
	let err, urls;
	[err, urls] = await to(Url.findAll({
		where: {
			UserId: user_id
		}
	}));
	
	res.status(200).send(urls);
});

urlRoutes.get("/new", authenticate, (req, res) => {
	let short_url = randomizer();
	res.status(200).send(short_url);
});

urlRoutes.post("/new", authenticate, async (req, res) => {
	let user_id = req.session.user_id;
	let err, url = req.body.longURL;
	let title = req.body.title;
	let urlInfo = {
		title: title,
		url : url,
		UserId: user_id,
		short_url: req.body.shortURL
	};
	[err, url] = await to(Url.create(urlInfo));
	if (err) {
		return res.status(500).send({ message: err.errors[0].message });
	};
	
	res.status(201).send({
          title: url.title,
          longUrl: url.url,
          shortUrl: url.short_url,
          date: url.createdAt
        });
});

urlRoutes.get("/:id", authenticate, async (req, res) => {
	let { id } = req.params;
	let user_id = req.session.user_id;
	let email = req.session.email;
	let err, url;
	
	[err, url] = await to(Url.findOne({
		where: {
			short_url: id
		}
	}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	let count, distinct, visitors;
	
	[err, count] = await to(url.countVisitors());
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	[err, distinct] = await to(Visitor.count({
		where: { UrlId: url['id'] },
		distinct: true,
		col: 'ip_address'
	}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	[err, visitors] = await to(Visitor.findAll({
		where: {
			UrlId: url['id']
		}
	}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}

	let data = {
		email: email,
		user_id: user_id,
		title: url['title'],
		shortURL: url["short_url"],
		longURL: url["url"],
		date: url["createdAt"],
		clickthroughs: count,
		uniqueClickthroughs: distinct,
		visitors:  visitors
	}
	res.status(200).send(data);
});

urlRoutes.get("/:id/search", authenticate, async (req, res) => {
	let { id } = req.params;
	let user_id = req.session.user_id;
	let b1 = req.query.dates1.split(/\D+/);
	let b2 = req.query.dates2.split(/\D+/);
	let date1 = new Date(b1[1], b1[2]-1, b1[3]-1);
	let date2 = new Date(b2[1], b2[2]-1, b2[3]-1);
	
	let err, url, visitors;
	const Op = require('../models').Sequelize.Op;
	
	[err, url] = await to(Url.findOne({
		where: {
			short_url: id
		}
	}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	console.log('date1', date1);
	[err, visitors] = await to(Visitor.findAll({
		where: {
			UrlId: url['id'],
			createdAt: {
				[Op.between]: [date1, date2]
			}
		},
		order: [['createdAt', 'ASC']]
	}));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	res.status(200).send(visitors);
});
  
// Update existing shortURL
urlRoutes.put("/:id", authenticate, async (req, res) => {
	let { id } = req.params;
	let err, urls;
	[err, urls] = await to(Url.update({
		title: req.body.title,
		url: req.body.longURL
	}, { where: { short_url: id } }
	));
	if (err) {
		return res.status(500).send({ message: err.message });
	};
	res.status(202).end();
});

// Deletion of existing short URL
urlRoutes.delete("/:id", authenticate, async (req, res) => {
	let { id } = req.params;
	let err, urls;
	[err, urls] = await to(Url.destroy({
		where: { short_url: id } 
	}));
	if (err) {
		console.log('ERROORRR');
		return;
	}
	req.flash('warning', "This URL has been deleted");
	res.redirect('/urls');
});

module.exports = urlRoutes;
