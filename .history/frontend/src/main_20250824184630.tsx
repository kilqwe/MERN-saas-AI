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
  // 1. Add global styles for the background
  styles: {
    global: {
      'body': {
        backgroundImage: 'url(/bg2.jpg")', // The path to your image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Keeps the background fixed during scroll
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider>
          <Toaster position='bottom-right' />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);