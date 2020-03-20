const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res) {
  let token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, config.secret, function(error, decoded) {
      if(error){
        res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
}
