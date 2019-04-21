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

module.exports = router;