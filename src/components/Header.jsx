import {
    AppBar,
    CssBaseline,
    Toolbar,
    Typography,
} from '@mui/material';

import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';

function Header({handleOpenModal}) {
    return (
        <><CssBaseline /><AppBar position='fixed'>
            <Toolbar sx={{
                pr: '24px', // keep right padding when drawer closed
            }}>
                <ChatIcon sx={{ mr: 2 }} />
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>Realtime Chat App with NextJS</Typography>
                <LogoutIcon sx={{ mr: 2 }} onClick={handleOpenModal} />
            </Toolbar>
        </AppBar></>);
}

export default Header;