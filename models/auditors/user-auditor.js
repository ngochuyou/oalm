module.exports = {
	validate : (body) => {
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
}