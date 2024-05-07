import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { jwtDecode } from 'jwt-decode'; 
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { logout } from '../actions/authActions'; // Import logout action

const getUserRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.user.role;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
};

function Layout() {
    // const [userRole, setUserRole] = useState(getUserRoleFromToken());
    const navigate = useNavigate(); // Initialize navigate function
    const dispatch = useDispatch(); // Initialize dispatch function

    // Get isLoggedIn state from Redux store
    const isLoggedIn = useSelector(state => state.auth.loggedIn);
    console.log(isLoggedIn)
    // Get userType state from Redux store
    const userType = useSelector(state => state.auth.userType);

    useEffect(() => {
        // const handleStorageChange = () => {
        //     setUserRole(getUserRoleFromToken());
        // };

        // window.addEventListener('storageChange', handleStorageChange);
        // setUserRole(getUserRoleFromToken());

        // return () => {
        //     window.removeEventListener('storageChange', handleStorageChange);
        // };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        // window.dispatchEvent(new Event('storageChange'));
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">Recipe Hub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {!userType && (
                                <Nav.Link as={Link} to="Home">Home</Nav.Link>
                            )}

                            {userType === 'chef' && (
                                <Nav.Link as={Link} to="Chef">Home</Nav.Link>
                            )}

                            {userType === 'user' && (
                                <Nav.Link as={Link} to="User">Home</Nav.Link>
                            )}

                            {userType === 'admin' && (
                                <Nav.Link as={Link} to="Admin">Home</Nav.Link>
                            )}

                            {userType !== 'admin' && (
                                <Nav.Link as={Link} to="About">About</Nav.Link>
                            )}

                            {userType === 'chef' && (
                                <>
                                    <Nav.Link as={Link} to="/createrecipe">Create</Nav.Link>
                                    <Nav.Link as={Link} to="/viewrecipes">View</Nav.Link>
                                    <Nav.Link as={Link} to="/UpdateRecipes">Manage</Nav.Link>
                                    <NavDropdown title="MyAccount" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/editprofile">Edit Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/Support">Support</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )}

                            {userType === 'user' && (
                                <>
                                    <Nav.Link as={Link} to="RecipeList">Recipes</Nav.Link>
                                    <Nav.Link as={Link} to="SavedRecipes">Favourites</Nav.Link>
                                    <NavDropdown title="MyAccount" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/editprofile">Edit Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/Support">Support</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )}

                            {userType === 'admin' && (
                                <>
                                    <Nav.Link as={Link} to="/AllUsers">Users</Nav.Link>
                                    <Nav.Link as={Link} to="/AllChefs">Chefs</Nav.Link>
                                    <Nav.Link as={Link} to="/AllRecipes">Recipes</Nav.Link>
                                    <NavDropdown title="MyAccount" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/editprofile">Edit Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/Support">Support</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            )}
                        </Nav>

                        {!userType && (
                            <Nav>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
}

export default Layout;


