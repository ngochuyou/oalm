module.exports = {
	backendURI: (process.env.NODE_ENV === 'production' ? 'http://oalm.herokuapp.com' : 'http://localhost:3000')
}