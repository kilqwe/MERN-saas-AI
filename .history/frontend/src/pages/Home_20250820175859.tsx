import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import TyperAnimation from '../components/typer/TyperAnimation';
import Footer from '../components/footer/Footer'; // <-- import your footer

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box width={'100%'} height={'100%'}>
      <Box sx={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "center", mx: "auto", mt: 3 }}>
        <Box><TyperAnimation /></Box>

        <Box sx={{
          width: "100%",
          display: "flex",
          flexDirection: { md: "row", xs: "column", sm: "column" },
          gap: 5,
          my: 10,
        }}>
          <img src='home2.jpg' alt='home2' style={{ width: "200px", margin: "auto", borderRadius:"10%"}} />
          <img className='image-inverted rotate' src='openai.png' alt='openai' style={{ width: "200px", margin: "auto", borderRadius:"50%"}} />
        </Box>

        <Box sx={{ display: "flex", width: "100%", mx: "auto" }}>
          <img
            src='chatbot.png'
            alt="chatbot"
            style={{
              display: "flex",
              margin: "auto",
              width: isBelowMd ? "80%" : "60%",
              borderRadius: "40px",
              boxShadow: "-5px -5px 105px #64f3d5",
              marginTop: 20,
              marginBottom: 20,
            }}
          />
        </Box>
      </Box>

     <Footer />
      
    </Box>
  );
}

export default Home;
