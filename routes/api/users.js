//  user.js -- server side
//  the user route

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User'); //  User model

// @route   POST api/users
// @desc    test route
// @access  Public
router.post(
  '/',
  //  See: https://express-validator.github.io/docs/
  [
    // format of all checks = what's being checked, error message
    // followed by rule(s) for checking
    // check for 'name' to be present and not empty
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    // check for 'email' to be valid format
    check('email', 'Please include a valid email').isEmail(),
    // check for 'password' to be 6 or more characters
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      password
    } = req.body;
    try {
      // see if the user exists
      let user = await User.findOne({
        email
      });
      //  use errors array to be consistent with display on the client side
      if (user) {
        return res.status(400).json({
          errors: [{
            msg: 'User already exists'
          }]
        });
      }

      // get the users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });


      // encrypt the password & save the user
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // return the jwt -- see https://jwt.io/#debugger
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'), {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;