import {
    Container,
    Box,
    Typography,
} from '@mui/material';

function Footer() {
    return (
      <Box
        component='footer'
        sx={{
          py: 1,
          px: 1,
          mt: 'auto'
        }}
        >
          <Container maxWidth='sm'>
            <Typography variant='body1'>
              NextJs Demo Chat App
            </Typography>
          </Container>
      </Box>
    )
  };

export default Footer;