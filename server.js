const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const app = express();

global.rootPath = path.resolve(__dirname);

app.use(express.json());

const db = config.get('mongoURI');

mongoose
	.connect(db, {
		dbName: 'graphO',
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(
		() => console.log('MongoAtlas Connected...')
	)
	.catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const port = process.env.PORT || 3000;

// allow cors
app.use(require('./middleware/cors.js'));

app.use('/api/users', require('./routes/apis/user.js'));
app.use('/api/auth', require('./routes/apis/auth.js'));
app.use('/api/graphs', require('./routes/apis/graphs.js'));
app.use('/api/files', require('./routes/apis/files.js'));

app.set('trust proxy', true);

app.listen(port, () => console.log('Started server on port ' + port));