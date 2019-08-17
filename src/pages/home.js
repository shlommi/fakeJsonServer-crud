import React, { useEffect, useState } from "react";
import axios from "axios";

import PostForm from "../components/PostForm";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [editingPost, setEditingPost] = useState({
    title: "",
    body: "",
    author: ""
  });

  useEffect(() => {
    axios
      .get("/posts")
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const editPost = post => {
    setEditingPost(post);
  };
  const deletePost = id => {
    axios.delete(`/posts/${id}`).then(() => {
      const postsUpdated = posts.filter(p => p.id !== id);
      setPosts(postsUpdated);
    });
  };

  const getAllNewPosts = newPost => {
    const allreadyExistPost = posts.find(item => item.id === newPost.id);
    if (allreadyExistPost) {
      const index = posts.indexOf(allreadyExistPost);
      const postsUpdated = [...posts];
      postsUpdated.splice(index, 1, newPost);
      setPosts(postsUpdated);
    } else {
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
    }
  };

  const getNumberOfPosts = () => {
    axios
      .get(`/posts?_start=0&_end=${limit}`)
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  };
  return (
    <div>
      <div className="row">
        <div className="col s6">
          <PostForm getAllNewPosts={getAllNewPosts} editingPost={editingPost} />
        </div>
        <div className="col s3">
          <p>Limit number of posts</p>
          <input
            type="number"
            value={limit}
            onChange={e => setLimit(e.target.value)}
          />
          <div
            className="waves-effect waves=light btn"
            onClick={getNumberOfPosts}
          >
            SET
          </div>
        </div>
      </div>
      <div className="row">
        {posts.map(post => (
          <div className="col s6" key={post.id} style={{ marginTop: "1rem" }}>
            <div className="card">
              <div className="card-content">
                <div className="card-title">{post.title}</div>
                <p>{post.body}</p>
                <p>{post.author}</p>
              </div>
              <div className="card-action">
                <a href="#" onClick={() => editPost(post)}>
                  EDIT
                </a>
                <a
                  href="#"
                  className="delete-btn"
                  onClick={() => deletePost(post.id)}
                >
                  DELETE
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
