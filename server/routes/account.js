const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const config = require("../config");
const checkJwt = require("../middlewares/jwt-check");

// Signup api
router.post("/signup", (req, res) => {
  console.log(req.body);

  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.picture = user.gravatar();
  user.isSeller = req.body.isSeller;

  // Creating new user in database, and checking if the user already exists
  User.findOne({ email: req.body.email }, (error, existingUser) => {
    if (existingUser) {
      res.json({
        success: false,
        message: "Account already exists with given email"
      });
    } else {
      user.save();

      var token = jwt.sign(
        {
          user: user
        },
        config.secret,
        {
          expiresIn: "2d"
        }
      );

      res.json({
        success: true,
        message: "Successfully signed up",
        token: token
      });
    }
  });
});

// Login api
router.post("/login", (req, res) => {
  console.log(req.body);

  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) throw error;

    if (!user) {
      res.json({
        success: false,
        message: "Login failed, user not found"
      });
    } else if (user) {
      var validatePassword = user.comparePassword(req.body.password);
      if (!validatePassword) {
        res.json({
          success: false,
          message: "Wrong password"
        });
      } else {
        var token = jwt.sign(
          {
            user: user
          },
          config.secret,
          {
            expiresIn: "2d"
          }
        );

        res.json({
          success: true,
          message: "Successfully logged in",
          token: token
        });
      }
    }
    console.log("8888888888888", user);
  });
});

//Profile api
router
  .route("/profile")
  .get(checkJwt, (req, res) => {
    console.log(req.body);
    User.findOne({ _id: req.decoded.user._id }, (error, user) => {
      res.json({
        success: true,
        message: "Successful",
        user: user
      });
    });
  })
  .post(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (error, user) => {
      console.log(req.body);
      if (error) return next(error);

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;
      user.isSeller = req.body.isSeller;

      user.save();
      res.json({
        success: true,
        message: "Successfully edited profile"
      });
    });
  });

//Address api
router
  .route("/address")
  .get(checkJwt, (req, res) => {
    console.log(req.body);
    User.findOne({ _id: req.decoded.user._id }, (error, user) => {
      res.json({
        success: true,
        message: "Successfull",
        address: user.address
      });
    });
  })
  .post(checkJwt, (req, res, next) => {
    console.log(req.body);
    User.findOne({ _id: req.decoded.user._id }, (error, user) => {
      if (error) return next(error);
      if (req.body.address1) user.address.address1 = req.body.address1;
      if (req.body.address2) user.address.address2 = req.body.address2;
      if (req.body.city) user.address.city = req.body.city;
      if (req.body.state) user.address.state = req.body.state;
      if (req.body.country) user.address.country = req.body.country;
      if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

      user.save();
      res.json({
        success: true,
        message: "Successfully edited your address"
      });
    });
  });

module.exports = router;
