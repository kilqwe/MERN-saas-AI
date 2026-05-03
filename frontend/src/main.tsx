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
// axios.defaults.baseURL = "https://mern-saas-ai.onrender.com/api/v1";
// axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;


const theme = extendTheme({
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
  },
  styles: {
    global: {
      'body': {
        backgroundImage: 'url("/bg2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      },
    },
  },
});

const toastOptions = {
  style: {
    background: 'rgba(40, 40, 40, 0.75)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)', // For Safari
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    color: '#fff',
    padding: '12px 18px',
  },

  success: {
    iconTheme: {
      primary: '#34D399', // Green
      secondary: '#1F2937',
    },
  },
  error: {
    iconTheme: {
      primary: '#F87171', // Red
      secondary: '#1F2937',
    },
  },
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <Toaster position='bottom-right' toastOptions={toastOptions} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);