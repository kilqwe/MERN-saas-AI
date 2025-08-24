// src/components/Header.tsx
import { AppBar, Toolbar, Box } from '@mui/material';
import React from 'react';
import Logo from './shared/Logo';
import { useAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink'; // We will replace the content of this file

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      position="sticky"
      sx={{
        // Positioning and Glassmorphism effect
        top: '1rem',
        mx: 'auto',
        maxWidth: 'lg',
        borderRadius: '50px',
        backgroundColor: 'rgba(17, 25, 40, 0.75)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)', // For Safari
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} /> {/* This pushes the links to the right */}
        {auth?.isLoggedIn ? (
          <>
            <NavigationLink to="/chat" text="Go To Chat" />
            <NavigationLink to="/" text="Logout" onClick={auth.logout} variant="ghost" />
          </>
        ) : (
          <>
            <NavigationLink to="/login" text="Login" variant="ghost" />
            <NavigationLink to="/signup" text="Signup" />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;