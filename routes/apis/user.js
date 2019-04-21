const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth.js');
const User = require('../../models/User.js');

const validate = (body) => {
	if (!body.username || !body.password || !body.name) {
		return 400;
	}

	if (body.username.length < 8 || body.username.length > 32) {
		return 400;
	}

	if (body.name.length < 1 || body.name.length > 32) {
		return 400;
	}

	if (body.password.length < 8 || body.password.length > 50) {
		return 400;
	}

	return new User({
		username: body.username,
		password: body.password,
		name: body.name
	});
}

// @route POST api/users
// @desc POST a user
// @access Public

router.post('/', (req, res) => {
	User.findById(req.body.id)
		.then(user => {
			if(user !== null) {
				return res.status(409).json({
					msg: 'User already exsited.'
				});
			}
		})

	const user = validate(req.body);

	if (user instanceof User) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) throw err;

				user.password = hash;
				user.remotes.push(req.ip.split(':').pop() || null);
				user.save()
					.then(user => {
						jwt.sign(
							{ id: user.id },
							config.get('jwtSecret'),
							{ expiresIn: 3600 },
							(err, token ) => {
								if (err) throw err;

								return res.status(200).json({
									token,
									user: {
										name: user.name,
										id: user.id,
										username: user.username
									}
								});
							}
						);
					});
			});
		});
	} else {
		return res.status(400).json({
			msg: 'Invalid fields.'
		});
	}
});

// @route PUT api/users
// @desc UPDATE a user
// @access Public

router.put('/', auth, (req, res) => {
	const id = req.user.id;
	const password = req.body.password;

	if (!password || !id) {
		return res.status(400).json({ msg: 'Bad request.' });
	}

	User.findById(id)
		.then(user => {
			if (!user) {
				return res.status(404).json({ msg: 'User not found.' });
			}

			bcrypt.compare(password, user.password)
				.then(
					isMatch => {
						if (!isMatch) {
							return res.status(400).json({ msg: 'invalid credentials.' });
						}

						const validation = validate(req.body.user);
						
						if (!(validation instanceof User)) {
							return res.status(400).json({ msg: 'Bad request.' });
						}

						validation._id = id;

						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(validation.password, salt, (err, hash) => {
								if (err) throw err;

								if (hash !== user.password) {
									validation.remotes = [];
								}

								validation.password = hash;

								const query = { _id: id };
								const options = { upsert: true, new: true, setDefaultsOnInsert: true };

								User.findOneAndUpdate(query, validation, options)
									.then(user => {
										return res.status(200).json({
											name: user.name,
											id: user.id,
											username: user.username,
											joinDate: user.joinDate
										});
									});	
							});
						});
					}
				)
		});
});

module.exports = router;