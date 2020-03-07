// auth.js -- server side
// authorize (or not) a user

const jwt = require('jsonwebtoken');
const config = require('config');

//  A middleware function -- takes in req (request), res (response), next (callback to move to next middleware function)
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); //header key

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // req.user is passed to all protected routes
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};