if (process.env.NODE_ENV === 'production')  {
	module.exports = {
		backendURI: 'http://oalm.herokuapp.com'
	}
} else {
	module.exports = {
		backendURI: 'http://localhost:3000'
	}
}
