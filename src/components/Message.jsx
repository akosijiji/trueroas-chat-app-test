import {
    Avatar,
    Box,
    Typography,
    Paper,
} from '@mui/material';
import moment from 'moment';

function Message ({ message, user }) {
    const isRecipient = message?.sender !== user?.email ? true : false;
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isRecipient ? 'flex-start' : 'flex-end',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: isRecipient ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: isRecipient ? '#e5e5ea' : '#1289fe', mr: 1, color: isRecipient ? '#000' : '#fff' }}>
            { message?.sender?.charAt(0).toUpperCase() }
          </Avatar>
          <Paper
            sx={{
              p: 1,
              backgroundColor: isRecipient ? '#e5e5ea' : '#1289fe',
            }}>
            <Typography variant='body1' color={ isRecipient ? '#000' : '#fff'}>{message.message}</Typography>
            <Typography variant='caption' color={ isRecipient ? '#000' : '#fff'}>{moment(message.timestamp).format('DD/MM/YYYY HH:mm')}</Typography>
          </Paper>
        </Box>
      </Box>
    );
};

export default Message;