import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <Box sx={{ backgroundColor: '#e1bee7', minHeight: '95vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container>
        <Box sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: '#ba68c8', marginTop: '30px', marginBottom: '40px' }}>
            About Us
          </Typography>
          <Typography variant="body1" sx={{marginBottom: '30px'}} paragraph>
            Recipe Hub is the ultimate culinary companion, offering a treasure trove of recipes to ignite your culinary creativity. 
            With a vast collection of dishes spanning cuisines from around the globe, Recipe Hub caters to every palate and dietary 
            preference. Whether you're a seasoned chef or a novice cook, our user-friendly interface makes it effortless to discover 
            new recipes, plan meals, and create shopping lists. From quick weekday dinners to lavish weekend feasts, Recipe Hub empowers 
            you to explore, experiment, and indulge in the joys of cooking. With detailed instructions, handy tips, and mouthwatering photos,
            each recipe is a culinary adventure waiting to be explored. Join the vibrant community of food enthusiasts, share your own 
            recipes, and embark on a flavorful journey with Recipe Hub today.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/Home"
            className="mt-3"
            sx={{
              display: 'block',
              margin: '0 auto',
              width: '200px',
              textAlign: 'center',
              bgcolor: '#ba68c8',
              '&:hover': { bgcolor: '#ab47bc' }
            }}
          >
            Go Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
