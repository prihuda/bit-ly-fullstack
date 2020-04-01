"use strict";

const express			= require('express');
const userRoutes	= express.Router();
const authService	= require('../services/auth.service');
const {to} = require('await-to-js');

userRoutes.post("/register", async (req, res) => {
	let { email, password } = req.body;

	/* if (!email) {
		req.flash('danger', "Please provide a valid email.");
		return res.redirect("/register");
	}

	if (!password) {
		req.flash('danger', "Please provide a password.");
		return res.redirect("/register");
	} */

	let err, user;
	[err, user] = await to(authService.createUser(req.body));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	
	let data = user.toWeb();
	req.session.token = user.getJWT();
	req.session.user_id = data.id;
	req.session.email = data.email;
	res.status(200).send({
		id: data.id,
		email: data.email,
		accessToken: user.getJWT()
	});
});

// Login form data
userRoutes.post("/login", async (req, res) => {
	let { email, password } = req.body;
	let err, user;

	[err, user] = await to(authService.authUser(req.body));
	if (err) {
		return res.status(500).send({ message: err.message });
	}
	let data = user.toWeb();
	req.session.token = user.getJWT();
	req.session.user_id = data.id;
	req.session.email = data.email;
	res.status(200).send({
		id: data.id,
		email: data.email,
		accessToken: user.getJWT()
	});
});

userRoutes.post("/logout", (req, res) => {
	req.session = null;
	res.status(200).send("Logged out.");
});

module.exports = userRoutes;