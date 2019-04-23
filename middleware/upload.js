const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.resolve(global.rootPath, 'uploaded'));
	},
	filename: (req, file, cb) => {
		const ext = req.query.ext;
		
		cb(null, new Date().getTime() + ( ext ? '.' + ext : '' ));
	}
});

const filter = (req, file, cb) => {
	cb(null, true);
}

module.exports = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: filter
});