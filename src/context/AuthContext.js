import React, { useContext, useState, useEffect, createContext } from 'react';
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth';
import firebase_app from '@/firebase/config';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const auth = getAuth(firebase_app);

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? 
            <div className="container">
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center' }}>
                    <CircularProgress />
                </Box>
            </div> : children}
        </AuthContext.Provider>
    );
};
