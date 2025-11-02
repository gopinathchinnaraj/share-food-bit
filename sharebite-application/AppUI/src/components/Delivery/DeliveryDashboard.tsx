import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the shape of each delivery post
interface DeliveryPost {
  _id: string;
  title: string;
  deliveryStatus: 'pending' | 'in_transit' | 'delivered';
}

const DeliveryDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch deliveries assigned to this delivery partner
  useEffect(() => {
    axios
      .get<DeliveryPost[]>('http://localhost:3008/api/posts/assigned')
      .then((res) => {
        setDeliveries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching deliveries:', err);
        setLoading(false);
      });
  }, []);

  // Update the delivery status
  const updateStatus = (postId: string, status: DeliveryPost['deliveryStatus']) => {
    axios
      .patch(`http://localhost:3008/api/posts/${postId}/status`, { status })
      .then(() => {
        setDeliveries((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, deliveryStatus: status } : post
          )
        );
      })
      .catch((err) => console.error('Error updating status:', err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Assigned Deliveries</h2>

      {loading ? (
        <p>Loading deliveries...</p>
      ) : deliveries.length === 0 ? (
        <p>No assigned deliveries</p>
      ) : (
        deliveries.map((post) => (
          <div
            key={post._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}
          >
            <h4>{post.title}</h4>
            <p>
              <strong>Status:</strong> {post.deliveryStatus}
            </p>
            <button
              onClick={() => updateStatus(post._id, 'in_transit')}
              disabled={post.deliveryStatus === 'in_transit' || post.deliveryStatus === 'delivered'}
              style={{ marginRight: '10px' }}
            >
              Mark In Transit
            </button>
            <button
              onClick={() => updateStatus(post._id, 'delivered')}
              disabled={post.deliveryStatus === 'delivered'}
            >
              Mark Delivered
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryDashboard;
