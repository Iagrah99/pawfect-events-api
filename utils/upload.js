const multer = require('multer');

// Store files in memory for quick base64 conversion
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
