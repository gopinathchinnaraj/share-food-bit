import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ChangeEvent } from 'react';
import { savePostData } from '../../services/api.service.savepost';
import { v4 } from 'uuid';
import img from '../../../static/images/pink donut.jpeg';
import WebFont from 'webfontloader';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/user-slice';
import { User } from '../../models/User';
import { Box, LinearProgress, Typography } from '@mui/material';
// No need for DeleteIcon here as it's for deletion, not creation
// import DeleteIcon from '@mui/icons-material/Delete';

// Bootstrap Dialog for styling the dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

// WebFont Loader for loading the fonts
WebFont.load({
  google: {
    families: ["Dancing Script", "cursive", "Open Sans", "sans-serif"]
  }
});

// NewPostComponentProps
interface NewPostComponentProps {
  open: boolean;
  handleClose: () => void; // Specify return type as void
}

// The NewPostComponent
function NewPostComponent({ open, handleClose }: NewPostComponentProps) {
  // useState for the form fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [streetName, setStreetName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [mealsDelivered, setMealsDelivered] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [postType, setPostType] = React.useState('');
  const [unit, setUnit] = React.useState(''); // Initialize as empty string
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // New state for upload progress
  const user: User | null = useSelector(selectUser());
  const [allergens, setAllergens] = useState<string[]>(['']); // Initialize with an empty string for the first input

  const apiKey = import.meta.env.VITE_LOCATIONIQ_ACCESS_TOKEN;

  // Function to check if all the required fields are filled
  const areAllRequiredFieldsFilled = () => {
    return (
      title !== '' &&
      caption !== '' &&
      streetName !== '' &&
      area !== '' &&
      city !== '' &&
      pinCode !== '' &&
      state !== '' &&
      postType !== '' &&
      imageUrl !== null && // Ensure image is uploaded
      (postType !== 'FoodAvailabilityPost' || shelfLife !== '') &&
      (postType !== 'RawMaterialPost' || (shelfLife !== '' && quantity !== 0)) &&
      (postType !== 'NGOPromotionalPost' || mealsDelivered !== '')
    );
  };

  // useEffect to check if all the required fields are filled
  useEffect(() => {
    setSaveDisabled(!areAllRequiredFieldsFilled());
  }, [title, caption, streetName, area, city, pinCode, state, shelfLife, postType, quantity, mealsDelivered, imageUrl]);


  const handleGenerateCoordinates = async () => {
    try {
      if (!apiKey) {
        throw new Error("LocationIQ API key is missing!");
      }

      const response = await axios.get('https://us1.locationiq.com/v1/search', {
        params: {
          key: apiKey,
          q: `${area}, ${city}`,
          format: 'json',
        },
      });

      const { data } = response;
      if (data && data.length > 0) {
        const lat = data[0].lat.toString();
        const lng = data[0].lon.toString();
        console.log('Coordinates:', lat, lng);
        return { lat, lng };
      } else {
        throw new Error("No results found for the given location.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to generate coordinates. Please check the address and try again.");
      throw error;
    }
  };

  // Function to handle the change in the post type
  const handleChange = (event: SelectChangeEvent) => {
    setPostType(event.target.value);
  };

  // Function to handle the change in the unit
  const handleChangeUnit = (event: SelectChangeEvent) => {
    setUnit(event.target.value);
  };

  // Function to handle the image upload to your Node.js backend
  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      // Replace with the URL of your Node.js server upload endpoint
      const response = await axios.post('http://localhost:3008/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming your backend returns the image URL in the response
      const { url } = response.data;
      if (url) {
        console.log('Image uploaded successfully. URL:', url);
        setImageUrl(url);
        alert('Image uploaded successfully!');
      } else {
        console.error('Upload failed: No URL returned from server.');
        alert('Image upload failed. No URL returned from server.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle the change in the allergens
  const handleAllergenChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newAllergens = [...allergens];
    newAllergens[index] = event.target.value;
    setAllergens(newAllergens);
  };

  // Function to add allergens
  const handleAddAllergen = () => {
    setAllergens([...allergens, '']);
  };

  // Function to remove allergens
  const handleRemoveAllergen = (index: number) => {
    const newAllergens = [...allergens];
    newAllergens.splice(index, 1);
    setAllergens(newAllergens);
  };

  // Function to handle saving the post
  const handleSavePost = async () => {
    try {
      if (!areAllRequiredFieldsFilled()) {
        alert("Please fill in all required fields and upload an image before saving.");
        return;
      }

      const newCoordinates = await handleGenerateCoordinates();
      const postData = {
        id: v4(),
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : user?.name,
        location: {
          id: v4(),
          streetName,
          area,
          city,
          pinCode,
          state,
          coordinates: newCoordinates
        },
        caption,
        title,
        postType,
        mediaDetails: {
          shelfLife,
          isVeg,
          allergens: allergens.filter(a => a.trim() !== ''), // Filter out empty allergen strings
          quantity,
          unit,
          mealsDelivered
        },
        isDeliveryDone: 0,
        isPickedUp: 0,
        userId: user?.id
      };
      console.log(postData);
      await savePostData(postData);
      alert('Post saved successfully!');
      handleClose(); // Close the dialog after successful save
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
        sx={{
          width: '1000px',
          height: '750px',
          margin: 'auto',
          '.MuiPaper-root': { borderRadius: '20px' }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          <Box
            component="div"
            sx={{
              width: 460,
              height: 686,
              backgroundImage: `url(${img})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box sx={{
            overflow: 'auto',
            scrollbarColor: '#FD514E #FFFFFF',
            scrollbarWidth: 'thin'
          }}>
            <Box>
              <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'center', color: '#FD514E', fontWeight: 'bold', fontSize: '40px', fontFamily: 'Dancing Script, cursive' }} id="customized-dialog-title">
                Share a Meal
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#FD514E',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent sx={{ marginTop: '0px', width: '470px', display: 'flex', flexDirection: 'column' }}>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                color: 'grey',
                fontSize: '16px',
                margin: '-20px 0px 10px 0px',
                fontFamily: 'Open Sans, sans-serif'
              }}>
                Create a New Post
              </Box>
              <TextField
                required
                id="outlined-required"
                label="Title"
                placeholder="Title"
                sx={{ marginTop: '20px', width: '440px' }}
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
              <TextField
                sx={{ marginTop: '20px', width: '440px' }}
                id="outlined-multiline-static"
                label="Add caption here"
                multiline
                rows={4}
                placeholder="Add caption here"
                onChange={(event) => setCaption(event.target.value)}
                required
                value={caption}
              />
              <TextField
                sx={{ marginTop: '20px', width: '440px' }}
                id="outlined-required"
                label="Street Name"
                placeholder="Street Name"
                onChange={(event) => setStreetName(event.target.value)}
                required
                value={streetName}
              />
              <TextField
                sx={{ marginTop: '20px', width: '440px' }}
                id="outlined-required"
                label="Area"
                placeholder="Area"
                onChange={(event) => setArea(event.target.value)}
                required
                value={area}
              />
              <TextField
                sx={{ marginTop: '20px', width: '440px' }}
                id="outlined-required"
                label="City"
                placeholder="City"
                onChange={(event) => setCity(event.target.value)}
                required
                value={city}
              />
              <TextField
                sx={{ marginTop: '20px', width: '440px' }}
                id="outlined-required"
                label="Zip Code"
                placeholder="Zip Code"
                onChange={(event) => setPinCode(event.target.value)}
                required
                value={pinCode}
              />
              <TextField
                sx={{ marginTop: '20px', width: '440px' }}
                id="outlined-required"
                label="State"
                placeholder="State"
                onChange={(event) => setState(event.target.value)}
                required
                value={state}
              />
              <FormControl sx={{ marginTop: '20px', maxWidth: '440px' }}>
                <InputLabel id="demo-simple-select-helper-label">Post Type</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={postType}
                  label="Post Type"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {user && (user.role === 'regularUser' || user.role === 'restaurent') && <MenuItem value={'FoodAvailabilityPost'}>Food Availability Post</MenuItem>}
                  {user && user.role === 'ngo' && <MenuItem value={'NGOPromotionalPost'}>NGO Promotional Post</MenuItem>}
                  {user && user.role === 'supplier' && <MenuItem value={'RawMaterialPost'}>Raw Material Post</MenuItem>}
                  {!user && (
                    <>
                      {/* These options should ideally not be available if no user is logged in,
                          or if the post types are restricted by user role.
                          Consider conditional rendering based on user existence and role. */}
                      <MenuItem value={'FoodAvailabilityPost'}>Food Availability Post</MenuItem>
                      <MenuItem value={'RawMaterialPost'}>Raw Material Post</MenuItem>
                      <MenuItem value={'NGOPromotionalPost'}>NGO Promotional Post</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
              {postType === 'FoodAvailabilityPost' && (
                <>
                  <TextField
                    sx={{ marginTop: '20px', width: '440px' }}
                    id="outlined-required"
                    label="Shelf Life"
                    placeholder="Shelf Life"
                    onChange={(event) => setShelfLife(event.target.value)}
                    required
                    value={shelfLife}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isVeg} onChange={(event) => setIsVeg(event.target.checked)} />}
                    label="isVeg"
                  />
                  {allergens.map((allergen, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                      <TextField
                        sx={{ width: '350px' }}
                        id={`allergen-${index}`}
                        label="Allergen"
                        value={allergen}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => handleAllergenChange(index, event)}
                      />
                      {allergens.length > 1 && ( // Only show remove button if there's more than one allergen field
                        <Button onClick={() => handleRemoveAllergen(index)} sx={{ ml: 1, color: '#FD514E' }}>Remove</Button>
                      )}
                    </Box>
                  ))}
                  <Button onClick={handleAddAllergen} sx={{ marginTop: '10px', color: '#FD514E' }}>Add Allergen</Button>
                </>
              )}
              {postType === 'RawMaterialPost' && (
                <>
                  <TextField
                    sx={{ marginTop: '20px', width: '440px' }}
                    id="outlined-required"
                    label="Shelf Life"
                    placeholder="Shelf Life"
                    onChange={(event) => setShelfLife(event.target.value)}
                    required
                    value={shelfLife}
                  />
                  <FormControl sx={{ marginTop: '20px', maxWidth: '440px' }}>
                    <InputLabel id="unit-select-label">Unit</InputLabel>
                    <Select
                      labelId="unit-select-label"
                      id="unit-select"
                      value={unit}
                      label="Unit"
                      onChange={handleChangeUnit}
                      required
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'kilogram'}>Kilograms (Kg)</MenuItem>
                      <MenuItem value={'pound'}>Pound (lb)</MenuItem>
                      <MenuItem value={'liter'}>Liter (L)</MenuItem>
                      <MenuItem value={'gallon'}>Gallon (gal)</MenuItem> {/* Corrected typo: galon -> gallon */}
                      <MenuItem value={'unit'}>Unit</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ marginTop: '20px', width: '440px' }}
                    id="outlined-required"
                    label="Quantity"
                    placeholder="Quantity"
                    type="number" // Ensure it's a number input
                    onChange={(event) => setQuantity(parseInt(event.target.value) || 0)} // Parse to int, default to 0 if invalid
                    required
                    value={quantity}
                  />
                </>)}
              {postType === 'NGOPromotionalPost' && (
                <>
                  <TextField
                    sx={{ marginTop: '20px', width: '440px' }}
                    id="outlined-required"
                    label="Meals Delivered"
                    placeholder="Meals Delivered"
                    onChange={(event) => setMealsDelivered(event.target.value)}
                    required
                    value={mealsDelivered}
                  />
                </>)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setSelectedImage(file);
                        setSelectedImageName(file.name);
                      }
                    }}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      sx={{
                        backgroundColor: 'black',
                        borderRadius: '20px',
                        '&:hover': {
                          backgroundColor: '#FD514E',
                        },
                      }}
                      variant="contained"
                      component="span"
                    >
                      Select Image
                    </Button>
                  </label>
                  {selectedImageName && <p style={{ marginTop: '5px' }}>{selectedImageName}</p>}
                </Box>
                <Button
                  disabled={!selectedImage || isUploading}
                  sx={{
                    backgroundColor: 'black',
                    width: '150px',
                    borderRadius: '20px',
                    '&:hover': {
                      backgroundColor: '#FD514E',
                    },
                  }}
                  variant="contained"
                  onClick={handleImageUpload}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Box>
              {isUploading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Uploading image, please wait...
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ width: '470px', justifyContent: 'center' }}>
              <Button
                sx={{
                  backgroundColor: 'black',
                  borderRadius: '20px',
                  '&:hover': {
                    backgroundColor: '#FD514E',
                  }
                }}
                variant="contained"
                autoFocus
                disabled={saveDisabled || isUploading}
                onClick={handleSavePost} // Call the new handleSavePost function
              >
                Save changes
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </BootstrapDialog>
    </React.Fragment>
  );
}

export default NewPostComponent;