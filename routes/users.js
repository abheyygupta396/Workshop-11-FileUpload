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


// 1. Create-user: When the api is called, a user will be created. Take Username and Password. 

router.post('/signup', function (req, res, next) {

  user.findOne({ username: req.body.username })
    .exec((error, result) => {
      if (result) {
        res.status(400).json({
          message: 'User already registered'
        });
      } else {
        const {
          username,
          password
        } = req.body;

        const _user = new user({
          username,
          password,

        });

        _user.save((error, data) => {
          if (error) {
            res.status(400).json({
              message: 'Something went wrong'
            });

          }

          if (data) {
            res.status(201).json({
              result: data
            });

          }

        });
      }
    });

});

//2. login-user: Username and password will be sent to the API. API will return a JWT token.

router.post('/signin', function (req, res, next) {

  user.findOne({ username: req.body.username, password: req.body.password })
    .exec((error, result) => {

      if (error) {
        res.status(400).json({ error });
      }
      else {
        // console.log(result);`
        if (result != null) {
          const token = jwt.sign({
            _username: user._username,
            _password: user._password
          }, 'secret',
            { expiresIn: '1h' })
          res.status(201).json({ result, token });

        }
        else {
          res.status(400).json('User Not found');
        }
      }
    });
});

//3. validate-user: Send token in the header > Authorization Header as a Bearer token. 
//   API will return true or false if the token is valid, Also for Middleware user

router.post('/profile', function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, 'secret');
  if (req.user = user) {
    // console.log(token);
    res.status(200).json({ user: 'logged in Succesfully' })
    //jwt.decode()
  }
});

//1) delete-file: Request Type: DELETE. It should be able to delete a given file ID. 

router.delete('/:userId', function (req, res, next) {

  user.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({ user: 'deleted Successfully' })
    })

    .catch(err => {
      console.log("error");
      res.status(500).json({ error: err });
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

// 3) Rename-file: Request Type: PUT. Ot should take a file ID and newName of the file. The code should rename the file. 

router.put('/:userId', function (req, res, next) {

  user.updateOne(
    { _id: req.params.userId },

    {
      $set: { username, password } = req.body,
    }
  )
    .then((result) => {
      res.status(200).json(result)
      console.log(result);
    }).catch((err) => { console.log(err) })

});

// Workshop: 12 :
// 1) MongoDB: Pagination & Sorting:

router.get('/paginate', async (req, res, next) => {
  try {
    let { page, size } = req.query

    if (!page) {
      page = 1
    }

    if (!size) {
      size = 2  //here we can define the size for records displayed on the page:  
    }

    const limit = parseInt(size)
    const skip = (page - 1) * size

    const users = await user.find().limit(limit).skip(skip);

    res.send({
      page,
      size,
      data: users,
    });
  }

  catch (error) {
    res.status(500).send(error.message);

  }


});

// 2) Mongodb: Search & Selection api :

router.get('/:name', (req, res, next) => {

  var regex = new RegExp(req.params.name, 'i');

  // user.find({"_id": ObjectId(req.params.name)}).then((result) => {

  user.find({ username: regex }).then((result) => {

    res.status(200).json(result)
    console.log(result);
  })
    .catch(err => { console.log(err) })

});



module.exports = router;




