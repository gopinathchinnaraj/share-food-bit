import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/user-slice';
import { User } from '../../models/User';

interface Post {
  _id: string;
  title: string;
  caption: string;
  status: string;
  image?: string;
  location: {
    city: string;
    state: string;
  };
  createdAt: string;
}

const NGODashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user: User | null = useSelector(selectUser());

  const fetchAssignedPosts = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await axios.get('/api/posts/assigned-to-ngo');
    console.log("API response:", res.data);

    // ✅ Always set an array
    setPosts(Array.isArray(res.data) ? res.data : res.data.posts || []);
  } catch (err) {
    console.error("Error fetching assigned posts", err);
    setError('Failed to fetch assigned posts');
    setPosts([]); // fallback
  } finally {
    setLoading(false);
  }
};

  const handleAccept = async (postId: string) => {
    try {
      await axios.patch(`/api/posts/${postId}/accept`);
      fetchAssignedPosts(); // Refresh the list
    } catch (err) {
      console.error("Error accepting post", err);
      setError('Failed to accept post');
    }
  };

  const handleReject = async (postId: string) => {
    try {
      await axios.patch(`/api/posts/${postId}/reject`);
      fetchAssignedPosts(); // Refresh the list
    } catch (err) {
      console.error("Error rejecting post", err);
      setError('Failed to reject post');
    }
  };

  useEffect(() => {
    if (user?.role === 'ngo') {
      fetchAssignedPosts();
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: '#FD514E' }}>
        Assigned Food Posts
      </Typography>
      
      {posts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No posts assigned yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            New food donation posts will appear here when they are assigned to your NGO.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {post.image && (
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover'
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#FD514E' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.caption}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={post.status} 
                      size="small"
                      color={
                        post.status === 'pending' ? 'warning' :
                        post.status === 'accepted' ? 'success' : 'error'
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    📍 {post.location.city}, {post.location.state}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Posted: {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleAccept(post._id)}
                    sx={{
                      mr: 1,
                      backgroundColor: 'black',
                      borderRadius: '20px',
                      '&:hover': {
                        backgroundColor: '#FD514E',
                      }
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleReject(post._id)}
                    sx={{
                      borderRadius: '20px',
                      borderColor: '#FD514E',
                      color: '#FD514E',
                      '&:hover': {
                        borderColor: '#FD514E',
                        backgroundColor: 'rgba(253, 81, 78, 0.1)'
                      }
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NGODashboard;