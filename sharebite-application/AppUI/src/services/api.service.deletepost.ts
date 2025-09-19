// services/api.service.deletepost.ts
import axios from 'axios';

// Ensure this URL matches your Node.js backend server.
const API_BASE_URL = 'http://localhost:3008'; 

export const deletePostData = async (postId: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
        console.log('Post deleted successfully:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error deleting post:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to delete post');
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};