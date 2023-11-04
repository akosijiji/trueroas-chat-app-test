'use client'
import React, { useState } from 'react';
import signUp from '@/firebase/auth/signup';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import { Button, CircularProgress, Container, CssBaseline, Grid, Link, Paper, 
    TextField, Typography } from '@mui/material';

import { getDatabase, ref, set } from 'firebase/database';
import { HOME_ROUTE, SIGNIN_ROUTE, USERS } from '@/utils/constants';
import { v4 as uuidv4 } from 'uuid';

function Page() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isClicked, setIsClicked] = useState(false);

    const database = getDatabase();

    const handleForm = async (event) => {
        event.preventDefault();
        setError(null); // Reset error message
        setIsLoading(true); // Set loading to true when the request starts
        if(!isClicked) setIsClicked(true);

        // Check if name is not empty
        if (name === '') {
            setIsLoading(false);
            setIsClicked(false);
            return setError('Error: name is empty');
        }

        const { result, error } = await signUp(email, password);
        if (error) {
            setError('Error: ' + error?.code);
            setIsLoading(false);
            setIsClicked(false);
            return console.error(error);
        }
        try {
            // Insert user to DB as well
            insertUser(result.user?.uid ?? uuidv4());
            // else successful
            console.log('success', result);
            return router.push(HOME_ROUTE);
        } catch (error) {
            // Capture the error message to display to the user
            setError(error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsClicked(false);
        }
    };

    const insertUser = (uid) => {
        try {
            set(ref(database, USERS + uid), {
                id: uid,
                email,
                name
            });
        } catch (error) {
            console.error(error);
        } 
    };

    return (
        <Container maxWidth="lg">
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
                            backgroundImage: "url(https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
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
                                <Typography component="h1" variant="h5">Sign up for an Account</Typography>
                                <Box
                                    component="form"
                                    noValidate
                                    onSubmit={handleForm}
                                    sx={{ mt: 1 }}>

                                    <TextField 
                                        margin="normal"
                                        required
                                        type="text" 
                                        name="name" 
                                        id="name"
                                        fullWidth
                                        onChange={(e) => setName(e.target.value)} 
                                        label="Name" />
                            
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
                                    {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
                                    
                                    {isLoading && (
                                           <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center' }} ><CircularProgress/></Container>
                                        )}
                                    
                                    <Button variant="contained" type="submit" fullWidth sx={{ mt: 3, mb: 2 }} disabled={isClicked}>Sign up</Button>
                                    <Grid container>
                                        <Grid item>
                                            <Link href={SIGNIN_ROUTE} variant="body2">
                                            {"Already have an account? Sign in"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
            </Box>
        </Container>);
}

export default Page;