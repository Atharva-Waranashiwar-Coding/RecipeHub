import React from 'react';
import mainCookImage from '../images/cook.png'; 
import styles from './Landing.module.css';
import biryani from '../images/biriyani.jpg';
import burger from '../images/burger.avif';
import pizza from '../images/pizza.avif';
import { Link } from 'react-router-dom';
import { Fade, Typography, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Landing = () => {
  const items = [
    { title: 'Biryani', chef: 'Sanjeev Kapoor', rating: '9.4', image: biryani },
    { title: 'Burger', chef: 'Burger King', rating: '9.0', image: burger },
    { title: 'Pizza', chef: 'Dominos', rating: '9.1', image: pizza },
  ];

  return (
    <div>
      <section className={styles.mainSection}>
        <img src={mainCookImage} alt="Chefs cooking" className={styles.mainImage} />
        <div className={styles.textOverlay}>
          <Fade in={true} timeout={1500}>
            <Typography variant="h2">Good Cooks Know How</Typography>
          </Fade>
          <Fade in={true} timeout={1500} style={{ transitionDelay: '500ms' }}>
            <Typography variant="h2" className={styles.purpleText}>Great Cooks Know Why</Typography>
          </Fade>
          {/* Style the Get Started Link */}
          <Button
            component={Link}
            to="/Home"
            variant="contained"
            size="large"
            sx={{ mt: 4, backgroundColor: '#6c5ce7', color: '#ffffff', '&:hover': { backgroundColor: '#4a3eab' } }}
          >
            Get Started
          </Button>
        </div>
      </section>

      <section className={`${styles.imageSection} d-flex justify-content-center flex-wrap`}>
        {items.map((item, index) => (
          <div key={index} className={styles.card}>
            <img src={item.image} alt={item.title} className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h5 className={styles.cardTitle}>{item.title}</h5>
              <p className={styles.cardChef}>{item.chef}</p>
            </div>
            <div className={styles.cardRating}>
              <b>Rating: {item.rating}</b>
            </div>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>Follow us on:</p>
        <div className={styles.socialIcons}>
          <a href="https://facebook.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
            <FacebookIcon />
          </a>
          <a href="https://twitter.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
            <TwitterIcon />
          </a>
          <a href="https://instagram.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
