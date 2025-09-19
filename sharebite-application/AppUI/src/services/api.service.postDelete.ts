import Swal from 'sweetalert2';
import { Constants } from './APIServiceConstants';

// Make sure your API URL is correct
const BASE_URL = "http://localhost:3008/api/posts"; // ✅ Your backend route


export const postDelete = async (id: string) => {
  try {
    const response = await fetch(`${Constants.API_URL}/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete');

    return true;
  } catch (err) {
    console.error('Error deleting post:', err);
    return false;
  }
};


{/*export const postDelete = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      Swal.fire({
        title: "Post deleted successfully!",
        icon: "success"
      });
      return true;
    } else {
      const errorData = await response.json();
      console.error("Server responded with error:", errorData);
      Swal.fire({
        title: "Failed to delete post!",
        text: errorData?.error || 'Unknown error',
        icon: "error"
      });
      return false;
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    Swal.fire({
      title: "Error!",
      text: "Could not connect to server.",
      icon: "error"
    });
    return false;
  }
};*/}

export default postDelete;
