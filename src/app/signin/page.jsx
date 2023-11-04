'use client'
import React, {useState} from 'react';
import signIn from '@/firebase/auth/signin';
import { useRouter } from 'next/navigation'
import { HOME_ROUTE } from '../../utils/constants';
import { Alert, Box, Button, Container, CssBaseline, Grid, Link, Paper, Snackbar, Stack,
    TextField, Typography } from '@mui/material';

function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

        if (error) {
            setError('Error: Unauthorized User');
            handleClick();
            return console.error(error)
        }

        // else successful
        console.log(result)
        return router.push(HOME_ROUTE)
    }
    return (
        <Container maxWidth='lg'>
        <Box
            sx={{
            marginTop: 8,
            }}>
                <Grid container>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                        // backgroundImage: "url(https://source.unsplash.com/random)",
                        backgroundImage: "url(https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: (t) =>
                            t.palette.mode === "light"
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        }}
                    />
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        component={Paper}
                        elevation={6}
                        square >
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}>
                            <Typography component="h1" variant="h5">Sign in</Typography>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleForm}
                                sx={{ mt: 1 }}>
                        
                                <TextField 
                                    margin="normal"
                                    required
                                    type="email" 
                                    name="email" 
                                    id="email"
                                    fullWidth
                                    onChange={(e) => setEmail(e.target.value)} 
                                    label="Email" />
                                <TextField
                                    margin="normal"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    autoComplete="current-password"
                                    name="password" 
                                    id="password" 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    />
                                <Button variant="contained" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>Sign in</Button>
                                <Grid container>
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                        {"Don't have an account? Click here to register"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar
                        open={open}
                        autoHideDuration={3000}
                        onClose={handleClose}
                    >
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {error}
                        </Alert>
                    </Snackbar>
                </Stack>
        </Box>
    </Container>
  );
}

export default Page;
