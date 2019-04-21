const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const app = express();

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

const port = process.env.PORT || 3000;

// allow cors
app.use(require('./middleware/cors.js'));

app.use('/api/users', require('./routes/apis/user.js'));
app.use('/api/auth', require('./routes/apis/auth.js'));
app.use('/api/graphs', require('./routes/apis/graphs.js'));

app.set('trust proxy', true);

app.listen(port, () => console.log('Started server on port ' + port));