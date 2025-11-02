import { useState, useEffect } from 'react';
import { Tab, Tabs } from '@mui/material';
import PostPageForProfile from './PostPageForProfile';
import DonationPageForProfile from '../components/Donation/DonationPageForProfile.tsx';
import NGODashboard from '../components/NGO/NGODashboard';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/user-slice';
import { User } from '../models/User';
import DeliveryDashboard from '../components/Delivery/DeliveryDashboard';

// Dashboard component
const Dashboard = () => {
  // State variables
  const [value, setValue] = useState(0);
  const [isNGO, setIsNGO] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const user: User | null = useSelector(selectUser());

  // Check if user is NGO
  useEffect(() => {
    if (user?.role === 'ngo') {
      setIsNGO(true);
    } else if(user?.role === 'delivery') {
      setIsDelivery(true);
    }
  }, [user]);

  // Handle change
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // If user is NGO, show NGO dashboard with different tabs
  if (isNGO) {
    return (
      <div>
        <Tabs value={value} onChange={handleChange} sx={{ mb: 5 }}>
          <Tab label="Assigned Posts" />
          <Tab label="Donations" />
          <Tab label="My NGO Posts" />
        </Tabs>
        {value === 0 && <NGODashboard />}
        {value === 1 && <DonationPageForProfile />}
        {value === 2 && <PostPageForProfile />}
      </div>
    );
  }

  if (isDelivery) {
    return (
      <div>
        <Tabs value={value} onChange={handleChange} sx={{ mb: 5 }}>
          <Tab label="Assigned Posts" />
          <Tab label="Donations" />
        </Tabs>
        {value === 0 && <DeliveryDashboard />}
        {value === 1 && <DonationPageForProfile />}
      </div>
    );
  }

  // Regular user dashboard
  return (
    <div>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 5 }}>
        <Tab label="My Posts" />
        <Tab label="My Donations" />
      </Tabs>
      {value === 0 && <PostPageForProfile />}
      {value === 1 && <DonationPageForProfile />}
    </div>
  );
}

export default Dashboard;