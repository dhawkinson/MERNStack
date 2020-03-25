// PostForm.js -- posts (client-side)
// The form for creating a post..

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addPost } from '../../actions/post'

const PostForm = ({ addPost }) => {
  // NOTE: we have only one field here so we only need one string for initialize text
  const [text, setText] = useState('')

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault()
          addPost({ text })
          setText('')
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
}

export default connect( null, { addPost } )(PostForm)
