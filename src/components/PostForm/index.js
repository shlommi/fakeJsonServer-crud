import React, { useEffect, useState } from "react";
import axios from "axios";

const PostForm = ({ getAllNewPosts, editingPost }) => {
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", author: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => setNewPost(editingPost), [editingPost]);

  const onChange = e => {
    setNewPost({ ...newPost, [e.target.name]: [e.target.value] });
  };

  const validateForm = () => {
    const tempErrors = {};
    if (newPost.title === "") {
      tempErrors.title = "title must not be empty";
    }
    if (newPost.body === "") {
      tempErrors.body = "body must not be empty";
    }
    if (newPost.author === "") {
      tempErrors.author = "author must not be empty";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return false;
    }
    return true;
  };

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    // validate the form
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    setErrors({});
    // end validate

    if (newPost.id) {
      axios
        .put(`/posts/${newPost.id}`, newPost)
        .then(res => {
          getAllNewPosts(res.data);
          setNewPost({ title: "", body: "", author: "" });
          setLoading(false);
        })
        .catch(err => console.log(err));
    } else {
      axios
        .post("/posts", newPost)
        .then(res => {
          getAllNewPosts(res.data);
          setNewPost({ title: "", body: "", author: "" });
          setLoading(false);
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <>
      {!loading ? (
        <form className="push-in" onSubmit={onSubmit}>
          <div className="input-field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={onChange}
              className={errors.title && "invalid"}
            />
            <span className="helper-text">{errors.title}</span>
          </div>

          <div className="input-field">
            <label htmlFor="body">Body</label>
            <input
              className={errors.body && "invalid"}
              type="text"
              name="body"
              value={newPost.body}
              onChange={onChange}
            />
            <span className="helper-text">{errors.body}</span>
          </div>
          <div className="input-field">
            <label htmlFor="author">Author</label>
            <input
              className={errors.author && "invalid"}
              type="text"
              name="author"
              value={newPost.author}
              onChange={onChange}
            />
            <span className="helper-text">{errors.author}</span>
          </div>
          <button type="submit" className="waves-effect waves-light btn">
            {newPost.id ? "UPDATE" : "ADD"}
          </button>
        </form>
      ) : (
        <div className="progress">
          <div className="indeterminate" />
        </div>
      )}
    </>
  );
};

export default PostForm;
