//  posts.js -- server side
//  the user route

const express = require('express');
const request = require('request')
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/', 
  [
    auth, 
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // get the current user to associate with the post
      const user = await User.findById(req.user.id).select('-password');
      // create the post
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      // save the post
      const post = await newPost.save();
      // return the post for use by the front end
      res.json(post);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // find all posts, sort by data newest first
    const posts = await Post.find().sort({ date: -1 });
    // send posts to front end
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // find post by Id
    const post = await Post.findById(req.params.id);
    // error if not found
    if ( !post ) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // send posts to front end
    res.json(post);
  } catch (err) {
    console.error(err.message);
    // error if not a valid post id
    if ( err.kind === 'ObjectId' ) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // find post by Id
    const post = await Post.findById(req.params.id);
    // error if not a valid post id
    if ( !post ) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // check on user, reject if not the owner
    if ( post.user.toString() !== req.user.id ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    // remove the post
    await post.remove();
    // send message to front end
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    // error if not a valid post id
    if ( err.kind === 'ObjectId' ) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // error if not a valid post id
    if ( err.kind === 'ObjectId' ) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    // check if post already liked by this user, reject
    if ( post.likes.filter( like => like.user.toString() === req.user.id ).length > 0 ) {
      return res.status(400).json({ msg: 'Post already liked by this user' });
    }
    // add the like to the front of the list
    post.likes.unshift({ user: req.user.id })
    // save it
    await post.save();
    // send likes to the front end
    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post (remove a like from a post)
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    // check if post already liked by this user, reject
    if ( post.likes.filter( like => like.user.toString() === req.user.id ).length === 0 ) {
      return res.status(400).json({ msg: 'Post has not yet been liked by this user' });
    }
    // get 'remove' index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    // remove the like to the front of the list
    post.likes.splice(removeIndex, 1)
    // save it
    await post.save();
    // send likes to the front end
    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a Post
// @access  Private
router.post(
  '/comment/:id', 
  [
    auth, 
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // get the current user to associate with the post
      const user = await User.findById(req.user.id).select('-password');
      // get the post
      const post = await Post.findById(req.params.id);
      // create a comment
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      // place the comment at the front of the list
      post.comments.unshift(newComment);
      // save the post
      await post.save();
      // return the post for use by the front end
      res.json(post.comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment on a Post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    // get the post
    const post = await Post.findById(req.params.id);
    // get the comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    // make sure we got the comment
    if ( !comment ) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // check - user can only delete their own comment
    if ( comment.user.toString() !== req.user.id ) {
      return res.status(401).json({ msg: 'User is not authorized' });
    }
    // get 'remove' index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
    // remove the like to the front of the list
    post.comments.splice(removeIndex, 1)
    // save it
    await post.save();
    // send likes to the front end
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;