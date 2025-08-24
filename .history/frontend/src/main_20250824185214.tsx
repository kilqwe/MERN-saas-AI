import { StrictMode } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import React from 'react';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Production API base URL
//axios.defaults.baseURL = "https://ventbot-saas-ai.onrender.com/api/v1";
axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

const theme = extendTheme({
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
  },
  styles: {
    global: {
      'body': {
        // ✅ FIX 1: Corrected the URL syntax (removed the extra quote)
        backgroundImage: 'url("/bg2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* ✅ FIX 2: Pass the custom theme to the provider */}
        <ChakraProvider theme={theme}>
          <Toaster position='bottom-right' />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);