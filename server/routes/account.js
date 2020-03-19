const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');

// Signup api
router.post('/signup', (req, res) => {
  console.log(req.body);

  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.picture = user.gravatar();
  user.isSeller = req.body.isSeller;

  // Creating new user in database, and checking if the user already exists
  User.findOne({email: req.body.email } , (error, existingUser) => {
    if(existingUser) {
      res.json({
        success: false,
        message: 'Account already exists with given email'
      });
    } else {
      user.save();

      var token = jwt.sign({
        user: user
      },
      config.secret,
      {
        expiresIn: '2d'
      });

      res.json({
        success: true,
        message: 'Successfully signed up',
        token: token
      });
    }
  });
});

// Login api
router.post('/login', (req, res) => {
  console.log(req.body);

  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) throw error;

    if(!user){
      res.json({
        success: false,
        message: 'Login failed, user not found'
      });
    }
    else if(user){
      var validatePassword = user.comparePassword(req.body.password);
      if(!validatePassword){
        res.json({
          success: false,
          message: 'Wrong password'
        });
      }
      else{
        var token = jwt.sign({
          user: user
        },
        config.secret,
        {
          expiresIn: '2d'
        });

        res.json({
          success: true,
          message: 'Successfully logged up',
          token: token
        });
      }
    }
  });
});

module.exports = router;
