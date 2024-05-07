import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Register = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/user/create', { fullName, email, password, role});
            console.log(response);
            navigate('/Login');
            setError('Registration functionality not implemented yet.');
        } catch (error) {
            setError('An unexpected error occurred. Please try again later.');
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
                    marginTop: 6,
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 4,
                    boxShadow: '0px 3px 6px #00000029',
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ color: 'teal' }}>Sign Up</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        type="fullName"
                        label="Name"
                        fullWidth
                        margin="normal"
                        autoFocus
                        required
                        value={fullName}
                        sx={textFieldStyles}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextField
                        type="email"
                        label="Email Address"
                        fullWidth
                        margin="normal"
                        required
                        value={email}
                        sx={textFieldStyles}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        type="password"
                        label="Password"
                        fullWidth
                        margin="normal"
                        required
                        value={password}
                        sx={textFieldStyles}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        type="password"
                        label="Confirm Password"
                        fullWidth
                        margin="normal"
                        required
                        value={confirmPassword}
                        sx={textFieldStyles}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" required sx={textFieldStyles}>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role-select"
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
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
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="chef">Chef</MenuItem>
                        </Select>
                    </FormControl>
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
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2 ,textAlign: 'center' }}>Already have an account? <Link to="/login">Sign In</Link></Typography>
                </Box>
            </Box>
        </Container>
    );
};

const textFieldStyles = {
    mb: 1,
    '& label.Mui-focused': {
      color: 'teal',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'teal',
      },
    },
};

export default Register;
