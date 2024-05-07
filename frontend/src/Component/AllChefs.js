import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Box, Typography, Pagination } from '@mui/material';

const ChefsPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); // State to manage current page

  const usersPerPage = 5; // Number of users per page

  useEffect(() => {
    // Fetch users for the current page when the page changes
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/getAllChefs`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('An unexpected error occurred');
      }
    };

    fetchUsers();
  }, [page]); // Fetch users when page changes

  const handleDeleteUser = async (email) => {
    try {
      const response = await axios.delete('http://localhost:5000/user/delete', {
        data: { email } // Pass email in the request body
      });
      if (response.status === 200) {
        // Update the users state after deleting the user
        setUsers(users.filter(user => user.email !== email));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('An unexpected error occurred');
    }
  };
  const indexOfLastPost = page * usersPerPage;
   const indexOfFirstPost = indexOfLastPost - usersPerPage;
   const currentUsers = users.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, value) => {
    setPage(value); // Update page state when page changes
  };

  return (
    <Box className="container" display="flex" flexDirection="column"  justifyContent="top !important" height="100vh" marginTop='50px'>
      <Typography variant="poster" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'green', marginTop: '30px', marginBottom: '30px' }}>
          Chefs List
      </Typography>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Number of recipes posted</TableCell>
            <TableCell>Action</TableCell> {/* Add column for delete button */}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentUsers.map(user => (
            <TableRow key={user.email}> {/* Use email as key */}
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.myRecipe.length}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDeleteUser(user.email)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(users.length / usersPerPage)} // Total number of pages
        page={page} // Current page
        onChange={handlePageChange} // Function to handle page change
        color="primary"
        size="large"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default ChefsPage;
