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

  // Fetch deliveries assigned to this delivery partner
  useEffect(() => {
    axios.get<DeliveryPost[]>('/api/posts/assigned-delivery')
      .then(res => setDeliveries(res.data))
      .catch(err => console.error('Error fetching deliveries', err));
  }, []);

  // Update the delivery status
  const updateStatus = (postId: string, status: DeliveryPost['deliveryStatus']) => {
    axios.patch(`/api/posts/${postId}/status`, { status })
      .then(() => {
        setDeliveries(prev =>
          prev.map(post =>
            post._id === postId ? { ...post, deliveryStatus: status } : post
          )
        );
      })
      .catch(err => console.error('Error updating status', err));
  };

  return (
    <div>
      <h2>Assigned Deliveries</h2>
      {deliveries.length === 0 ? (
        <p>No assigned deliveries</p>
      ) : (
        deliveries.map(post => (
          <div key={post._id}>
            <h4>{post.title}</h4>
            <p>Status: {post.deliveryStatus}</p>
            <button onClick={() => updateStatus(post._id, 'in_transit')}>Mark In Transit</button>
            <button onClick={() => updateStatus(post._id, 'delivered')}>Mark Delivered</button>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryDashboard;
