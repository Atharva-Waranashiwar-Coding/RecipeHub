import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, Accordion, AccordionSummary, AccordionDetails, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Support = () => {
  const [tabValue, setTabValue] = useState('1');

  useEffect(() => {

    document.body.style.backgroundColor = '#3f51b5';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}> {/* Changed maxWidth to 'lg' for a larger container */}
      <Box sx={{ 
        bgcolor: 'skyblue', 
        color: 'white', 
        p: 2, 
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: '100%', // Ensure the Box fills the Container
      }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="Support tabs"
          textColor="inherit"
          indicatorColor="secondary"
          variant="fullWidth" // Makes tabs take up the full container width
          centered // Centers the tabs
        >
          <Tab label="Our Team" value="1" sx={{ width: 'auto' }} />
          <Tab label="Contact" value="2" sx={{ width: 'auto' }} />
          <Tab label="FAQ" value="3" sx={{ width: 'auto' }} />
        </Tabs>
        {tabValue === '1' && (
          <Box p={3}>
            <Typography>Name: Atharva Ajit Waranashiwar | Email: waranashiwar.a@northeastern.edu</Typography>
            <Typography>Name: Anish Kuila | Email: kuila.a@northeastern.edu</Typography>
            <Typography>Name: Steffi Gundappa Manhalli | Email: lnu.ste@northeastern.edu</Typography>
            <Typography>Name: Manikanta Pitchaiah Kapalavai | Email: kapalavai.m@northeastern.edu</Typography>
          </Box>
        )}
        {tabValue === '2' && (
          <Box p={3}>
            <Typography>Contact Number: +1 (617)7654-321</Typography>
          </Box>
        )}
        {tabValue === '3' && (
          <Box p={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography>Why choose us?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                    Choose Recipe Hub for its diverse, quality recipes, user-friendly interface, and vibrant community. With personalized experiences and constant 
                    updates, Recipe Hub is your ultimate destination for culinary exploration.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                <Typography>How do I get started?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                    Getting started with Recipe Hub is effortless. Simply sign up, explore our diverse collection of recipes, and save your favorites for later. 
                    You can even contribute your own recipes and engage with a vibrant community of food enthusiasts. Choose Recipe Hub for its user-friendly interface, 
                    quality recipes, and personalized experience. With constant updates and a commitment to culinary excellence, Recipe Hub is your go-to destination for 
                    all things food.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Support;
