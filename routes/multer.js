const multer = require("multer");

var mul = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },

    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }

});

var upload = multer({ storage: mul })

module.exports = upload;