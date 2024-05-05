const fs = require('fs');
var path = require('path');
const multer = require('multer')

const uploadDirectory = './uploads';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        //cb(null, Date.now() + '-' + file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;