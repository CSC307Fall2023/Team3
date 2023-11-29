'use client'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar';
import Login from './Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Signup from './Signup';
import { useSession } from 'next-auth/react';
import { Button } from '@mui/material';
import { signOut } from "next-auth/react"
import SantaSleigh from 'src/app/SantaSleigh'; 
import React, { useState } from 'react';
import homeStyle from 'src/app/homestyle.module.css'

const theme = createTheme({});

export default function RootLayout({ children, title }) {

  const { data: session, status }  = useSession();
  const [showSanta, setShowSanta] = useState(true);

  const toggleSanta = () => {
    setShowSanta((prevShow) => !prevShow);
  };
  let loginSection;

  if (status === 'authenticated') {
    loginSection = <Button variant="outlined" color="inherit" onClick={() => signOut()}>Sign Out</Button>;
  } else {
    loginSection = <>
      <Login/>
      <Signup/>
    </>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="static"
        sx={{
          background:
            'repeating-linear-gradient(45deg, #f44336, #f44336 10%, #4caf50 10%, #4caf50 20%)',
        }}>

        { /* showSanta && <SantaSleigh />} {/* Add your SantaSleigh component */}
      {/* Other content */}
      { /* <button onClick={toggleSanta}>{showSanta ? 'Hide Santa' : 'Show Santa'}</button> */ }
   
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {title}
              </Typography>
              <NavBar />
              <Box sx={{ flexGrow: 0 }}>
                <Stack direction='row' spacing={2}>
                  {loginSection}
                </Stack>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </ThemeProvider>

  );
}
