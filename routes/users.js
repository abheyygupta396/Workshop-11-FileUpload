var express = require('express');
var router = express.Router();
const app = express();
const user = require('./schema');
const jwt = require('jsonwebtoken');
var fileUpload = require('express-fileupload');
const cron = require('node-cron');
var upload = require('./multer');


// var ObjectId = require('mongodb').ObjectId;

app.use(fileUpload());


// Sample to check api working.
router.get('/', function (req, res, next) {
  res.status(200).json({
    message: ` Hello ${req.body.name} from server `
  });
});




// 2) upload: Request Type: POST. The api will return a file object with ID which is saved on the server.

router.post('/upload', upload.single('image'), function (req, res, next) {
  res.send({
    success: true,
    message: 'file uploaded successfully',
    file: req.file
  });

});





module.exports = router;




