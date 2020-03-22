const jwt = require("jsonwebtoken");
const config = require("../config");

// Jwt token checking ...if its's valid or not
module.exports = function(req, res, next) {
  // requesting token from headers..wheather it contains any tokens
  let token = req.headers["authorization"] || req.headers["Authorization"];
  console.log(token);

  if (token) {
    jwt.verify(token, config.secret, function(error, decoded) {
      // checking the token expiry...if error below code runs
      if (error) {
        console.log("************************************************");
        console.log(error);
        res.json({
          success: false,
          message: "Failed to authenticate token"
        });
      } else {
        // decoding the token so user can access the users object
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //if the token is not found
    res.status(403).json({
      success: false,
      message: "No token provided"
    });
  }
};

// let token = req.cookies["Authorization"];
// if (!token) {
//   return res.redirect("/");
// }
// jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
//   if (!err && decoded) {
//     req.user = decoded;
//     next();
//   } else {
//     console.log(err);
//     return res.redirect("/");
//   }
// });
