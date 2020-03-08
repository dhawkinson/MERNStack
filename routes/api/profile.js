//  profile.js -- server side
//  the user profile route

const express = require('express');
const request = require('request')
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    //  locate the user and populate the name and avatar
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    //  if no profile
    if (!profile) {
      return res.status(400).json({
        msg: 'There is no profile for this user'
      });
    }
    //  else return profile to front end
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  POST api/profile
//  @desc   Create or Update user profile
//  @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {}; //  to prevent undefined
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {}; //  to prevent undefined
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        // send profile to front end
        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      // send profile to front end
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//  @route  GET api/profile
//  @desc   Get all profiles
//  @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    // send profiles to front end
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  GET api/profile/user/:user_id
//  @desc   Get profile by user ID
//  @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    // send profile to front end
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

//  @route  DELETE api/profile
//  @desc   Delete profile, user & posts
//  @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    // Remove Posts
    // placeholder await Post.findOneAndRemove({ user: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  PUT api/profile/experience 
//  *** (PUT rather than POST - updating a subset of Profile rather than a new entity) but could be either ***
//  @desc   Add profile experience
//  @access Private
router.put(
  '/experience', 
  [
    auth,
    [
      check('title', 'Title is required')
      .not()
      .isEmpty(),
      check('company', 'Company is required')
      .not()
      .isEmpty(),
      check('from', 'From date is required')
      .not()
      .isEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
  try {
    // find the profile
    const profile = await Profile.findOne({ user: req.user.id });
    // pop the experience object on the from of the experience array (unshift)
    profile.experience.unshift(newExp);
    // save the profile
    await profile.save();
    // return the profile (for the front-end)
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  DELETE api/profile/experience 
//  *** (DELETE rather than PUT - deleting a subset of Profile rather than simple update) but could be either ***
//  @desc   Delete profile experience
//  @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // Remove Profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex,1);
    // save the profile
    await profile.save();
    // return the profile (for the front-end) NOTE: the specific experience has been removed
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  PUT api/profile/

//  @route  PUT api/profile/experience 
//  *** (PUT rather than POST - updating a subset of Profile rather than a new entity) but could be either ***
//  @desc   Add profile experience
//  @access Private
router.put(
  '/experience', 
  [
    auth,
    [
      check('title', 'Title is required')
      .not()
      .isEmpty(),
      check('company', 'Company is required')
      .not()
      .isEmpty(),
      check('from', 'From date is required')
      .not()
      .isEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }
  try {
    // find the profile
    const profile = await Profile.findOne({ user: req.user.id });
    // pop the experience object on the from of the experience array (unshift)
    profile.experience.unshift(newExp);
    // save the profile
    await profile.save();
    // return the profile (for the front-end)
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  DELETE api/profile/experience 
//  *** (DELETE rather than PUT - deleting a subset of Profile rather than simple update) but could be either ***
//  @desc   Delete profile experience
//  @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // Remove Profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex,1);
    // save the profile
    await profile.save();
    // return the profile (for the front-end) NOTE: the specific experience has been removed
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}); 
//  *** (PUT rather than POST - updating a subset of Profile rather than a new entity) but could be either ***
//  @desc   Add profile education
//  @access Private
router.put(
  '/education', 
  [
    auth,
    [
      check('school', 'School is required')
      .not()
      .isEmpty(),
      check('degree', 'degree is required')
      .not()
      .isEmpty(),
      check('fieldofstudy', 'Field Of Study is required')
      .not()
      .isEmpty(),
      check('from', 'From date is required')
      .not()
      .isEmpty()
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }
  try {
    // find the profile
    const profile = await Profile.findOne({ user: req.user.id });
    // pop the education object on the from of the education array (unshift)
    profile.education.unshift(newEdu);
    // save the profile
    await profile.save();
    // return the profile (for the front-end)
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  DELETE api/profile/education/:edu_id 
//  *** (DELETE rather than PUT - deleting a subset of Profile rather than simple update) but could be either ***
//  @desc   Delete profile education
//  @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // Remove Profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex,1);
    // save the profile
    await profile.save();
    // return the profile (for the front-end) NOTE: the specific education has been removed
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//  @route  GET api/profile/github/:username 
//  @desc   Get user repos from github
//  @access Public
router.get('/github/:username', async (req, res) => {
  try {
    // set options
    const options = { 
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created: asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
     };

    //  make the request
    request(options, (error, response, body) => {
      if(error) console.error(error);

      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }
      // send back a JSON Object to front end
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
