// src/services/post.service.ts
import axios from "axios";

export const getAssignedPosts = async () => {
  try {
    const res = await axios.get("/api/posts/assigned-to-ngo");
    return Array.isArray(res.data) ? res.data : []; // ✅ normalize response
  } catch (error) {
    console.error("Error fetching assigned posts", error);
    return [];
  }
};

export const acceptPost = async (postId: string) => {
  try {
    await axios.patch(`/api/posts/${postId}/accept`);
    return true;
  } catch (error) {
    console.error(`Error accepting post ${postId}`, error);
    return false;
  }
};

const api = axios.create({
  baseURL: 'http://localhost:3008/api', // adjust port
  withCredentials: true, // if needed
});

export default api;