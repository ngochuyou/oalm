const router = require('express').Router();
const fs = require('fs');
const upload = require('../../middleware/upload.js')
const auth = require('../../middleware/auth.js');
const path = require('path');

const mimes = [
	'ascii', 'utf8', 'utf16le',
	'ucs2', 'base64', 'binary', 'hex'
];

// @route POST api/files/
// @desc UPLOAD a file
// @access Private

router.post('/', auth, upload.single('file'), (req, res) => {
	return res.status(200).end(req.file.filename);
});

// @route GET api/files/
// @desc GET a file
// @access Private

router.get('/:filename', auth, (req, res) => {
	const filename = req.params.filename;

	if (!filename || filename.length === 0) {
		return res.status(400).json({ msg: 'Bad request.' });
	}

	fs.readFile(path.resolve(global.rootPath, 'uploaded', filename), (err, data) => {
		if (err) {
			return res.status(404).json({ msg: 'File not found.' });
		}

		const mime = req.query.m;
			
		if (mime) {
			if (mimes.includes(mime)) {
				return res.status(200).end(Buffer.from(data).toString(mime));
			}

			return res.status(400).json({ msg: 'Bad request.' });
		}

		return res.status(200).end(Buffer.from(data).toString('base64'));
	});
});

module.exports = router;