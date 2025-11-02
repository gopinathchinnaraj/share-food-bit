import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, styled } from "@mui/material";
import img from '../../../static/images/event register.jpeg';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { registerForEvent } from "../../services/api.service.registerForEvent";
import Media from "../../models/Media";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface RegisterEventComponentProps {
  open: boolean;
  handleClose: () => void;
  eventData: Media;
}

interface RegisterEventData {
  id: string;
  Name: string;
  email: string;
  supportAs: string;
  createdAt: Date;
  updatedAt: Date;
  eventData: Media;
}

function RegisterEventComponent({ open, handleClose, eventData }: RegisterEventComponentProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [supportAs, setSupportAs] = useState('');
  const [saveDisabled, setSaveDisabled] = useState(true);

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      name !== '' &&
      email !== '' &&
      supportAs !== '' &&
      isEmailValid(email)
    );
  };

  useEffect(() => {
    setSaveDisabled(!isFormValid());
  }, [name, email, supportAs]);

  const handleChange = (event: SelectChangeEvent) => {
    setSupportAs(event.target.value);
  };

  const handleSubmit = () => {
    const eventDataSchema: RegisterEventData = {
      id: v4(),
      Name: name,
      email: email,
      supportAs: supportAs,
      createdAt: new Date(),
      updatedAt: new Date(),
      eventData: eventData
    };
    
    registerForEvent(eventDataSchema);
    handleClose();
    
    // Reset form
    setName('');
    setEmail('');
    setSupportAs('');
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="lg"
      sx={{ 
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
        <Box sx={{ overflow: 'auto', width: 470 }}>
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'center', color: '#FD514E', fontWeight: 'bold', fontSize: '40px', fontFamily: 'Dancing Script, cursive' }}>
            Register for an Event
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
          <DialogContent sx={{ marginTop: '0px', display: 'flex', flexDirection: 'column' }}>
            <TextField
              required
              id="name"
              label="Name"
              placeholder="Name"
              value={name}
              sx={{ marginTop: '20px', width: '100%' }}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              required
              id="email"
              label="Email"
              placeholder="Email"
              value={email}
              sx={{ marginTop: '20px', width: '100%' }}
              onChange={(event) => setEmail(event.target.value)}
              error={email !== '' && !isEmailValid(email)}
              helperText={email !== '' && !isEmailValid(email) ? 'Invalid email format' : ''}
            />
            <FormControl sx={{ marginTop: '20px', width: '100%' }}>
              <InputLabel id="support-as-label">Support As</InputLabel>
              <Select
                labelId="support-as-label"
                id="support-as"
                value={supportAs}
                label="Support As"
                onChange={handleChange}
                required
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Chef">Chef</MenuItem>
                <MenuItem value="Kitchen Support">Kitchen Support</MenuItem>
                <MenuItem value="Delivery partner">Delivery partner</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
            <Button
              sx={{
                backgroundColor: 'black',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#FD514E',
                }
              }}
              variant="contained"
              onClick={handleSubmit}
              disabled={saveDisabled}
            >
              Register
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </BootstrapDialog>
  );
}

export default RegisterEventComponent;