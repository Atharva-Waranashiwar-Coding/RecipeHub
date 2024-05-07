import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { loginSuccess,loginFailure } from '../actions/authActions';
import { useDispatch } from 'react-redux'; // Import useSelector and useDispatch

const Login = () => {
    const navigate = useNavigate();
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch(); // Initialize useDispatch hook

    useEffect(() => {
        document.body.style.backgroundColor = '#b2dfdb';
        return () => {
          document.body.style.backgroundColor = '';
        };
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/user/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                const decodedToken = jwtDecode(response.data.token);
                const user = decodedToken.user;
                console.log("Decoded user:", user);
                localStorage.setItem('userId', user.userId);
                // window.dispatchEvent(new Event('storageChange'));
                const userRole = user.role;
                dispatch(loginSuccess(response.data.token, userRole)); // Dispatch loginSuccess action
                switch (userRole) {
                    case 'user':
                        navigate('/User');
                        break;
                    case 'chef':
                        navigate('/Chef');
                        break;
                    case 'admin':
                        navigate('/Admin');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError('Invalid username or password.');
                dispatch(loginFailure('Invalid username or password.'));
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
            dispatch(loginFailure('Invalid username or password.'));
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    marginTop: 20,
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 4,
                    boxShadow: '0px 3px 6px #00000029',
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ color: 'teal' }}>Sign In</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        type="email"
                        label="Email"
                        fullWidth
                        margin="normal"
                        autoFocus
                        required
                        value={email}
                        sx={{ 
                            mb: 1,
                            '& label.Mui-focused': {
                              color: 'teal',
                            },
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'teal',
                              },
                            },
                          }}
              
                        onChange={(e) => setemail(e.target.value)}
                    />
                    <TextField
                        type="password"
                        label="Password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        sx={{ 
                            mb: 1,
                            '& label.Mui-focused': {
                              color: 'teal',
                            },
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: 'teal',
                              },
                            },
                          }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography component="p" color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, backgroundColor: "#26a69a", '&:hover': { backgroundColor: '#009688' } }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2 ,textAlign: 'center' }}>Don't have an account? <Link to="/Register">Sign up</Link></Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;

