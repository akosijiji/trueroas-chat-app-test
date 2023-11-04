'use client'
import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

import { getDatabase, ref, onValue, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import { CHATS, SIGNIN_ROUTE } from '@/utils/constants';

import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Message from '@/components/Message';
import Header from '@/components/Header';

import {
    Alert,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Grid,
    Paper,
    Snackbar,
    Stack,
  } from '@mui/material';

import { redirect } from 'next/navigation';

function Page() {
    const { user } = useAuthContext();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    console.log('user ', user);

    const auth = getAuth();
    const database = getDatabase();

    useEffect(() => {
      if (user == null) return redirect(SIGNIN_ROUTE);
    }, [user])

    useEffect(() => {
      const chatsRef = ref(database, CHATS);

      try {
        onValue(chatsRef, (snapshot) => {
          let chats = [];
          snapshot.forEach((snap) => {
            chats.push(snap.val());
          });
          const sortedChats = chats.sort((function (a, b) { 
            return new Date(a.timestamp) - new Date(b.timestamp) 
          }));
          setMessages(sortedChats);
        });
      } catch (error) {
        console.error(error);
      }
    }, []);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };

    const handleLogout = () => {
      // Close Modal
      handleCloseModal();
      signOut(auth).then(() => {
        // Sign-out successful.
        router.push(SIGNIN_ROUTE);
        console.log('Signed out successfully');
      }).catch((error) => {
        // An error happened.
        setError(error);
        console.error('Error', error);
      });
    };

    const CustomDialog = ({ open, onClose, title, content }) => {
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>
            {title}
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}
            >
              <CloseIcon />
              </IconButton>
          </DialogTitle>
          <DialogContent dividers>{content}</DialogContent>
          <DialogActions>
            <Button onClick={handleLogout} color='warning'>
              Log Out
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    const ChatUI = () => {
        const [input, setInput] = useState('');
      
        /**
         * 
         * Check if there's an existing chat message
         * 
        */
        const handleSend = () => {
          if (input.trim() !== '') {
            console.log(input);
            setInput('');
            set(ref(database, CHATS + uuidv4()), {
              id: uuidv4(),
              sender: user?.email,
              message: input,
              timestamp: Date.now(),
            });
          } else {
            // Display a snackbar error message
            setError('Error: Please type a message before clicking Send');
            handleClick();
          }
        };

        
        const handleInputChange = (event) => {
          setInput(event.target.value);
        };
      
        return (
          <div>
            <Header handleOpenModal={handleOpenModal} />
            {/* Content */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              {/* Message Component */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 10, pb: 10, pr: 2, pl: 2 }}>
                {messages && messages.length > 0 ? messages?.map((message) => (
                  <Message key={message.id} message={message} user={user}  />
                )) :
                  <label>No messages yet</label>
                }
              </Box>
              {/* TextInput Component */}
              <Paper  
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  width: '100%'
                }} square variant='outlined'>
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <TextField
                      size='small'
                      fullWidth
                      placeholder='Type a message'
                      variant='outlined'
                      value={input}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      fullWidth
                      color='primary'
                      variant='contained'
                      endIcon={<SendIcon />}
                      onClick={handleSend}
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              </Paper>
            </Box> 
           
            {/* Snackbar for Error Message */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
                  {error}
                </Alert>
              </Snackbar>
            </Stack>

            <CustomDialog
              open={openModal}
              onClose={handleCloseModal}
              title='Warning'
              content='Are you sure you want to log out?'
            />
          </div>
          
        );
    };

    return (<ChatUI />);
}

export default Page;
