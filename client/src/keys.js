module.exports = {
	backendURI: (process.env.NODE_ENV === 'production' ? 'http://oursecret-dc.herokuapp.com' : 'http://localhost:3000')
}