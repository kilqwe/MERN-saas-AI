import { StrictMode } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import React from 'react';

// Import Chakra UI components
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

// Production API base URL
//axios.defaults.baseURL = "https://ventbot-saas-ai.onrender.com/api/v1";
axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;

// 1. Create a custom theme with Chakra's `extendTheme`
const theme = extendTheme({
  colors: {
    // These names can be used directly in style props, e.g., color="primary"
    primary: '#1976d2',
    secondary: '#dc004e',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* 2. Replace ThemeProvider with ChakraProvider */}
        <ChakraProvider theme={theme}>
          <Toaster position='top-right' />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);