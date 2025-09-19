import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NGODashboard = () => {
  const [posts, setPosts] = useState([]);

  const fetchAssignedPosts = async () => {
    try {
      const res = await axios.get('/api/posts/assigned-to-ngo'); // adjust API path as needed
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching assigned posts", err);
    }
  };

  const handleAccept = async (postId: string) => {
    await axios.patch(`/api/posts/${postId}/accept`);
    fetchAssignedPosts();
  };

  useEffect(() => {
    fetchAssignedPosts();
  }, []);

  return (
    <div>
      <h2>Assigned Food Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        posts.map((post: any) => (
          <div key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.caption}</p>
            <button onClick={() => handleAccept(post._id)}>Accept</button>
          </div>
        ))
      )}
    </div>
  );
};

export default NGODashboard;
