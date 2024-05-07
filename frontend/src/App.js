import React, { useEffect } from 'react';
import './App.css';
import Home from './Component/Home';
import RecipeList from './Component/RecipeList';
import SavedRecipes from './Component/SavedRecipes';
import Layout from './Component/Layout';
import Landing from './Component/Landing';
import Login from './Component/Login';
import Register from './Component/Register';
import Admin from './Component/Admin';
import User from './Component/User';
import Chef from './Component/Chef';
import ViewRecipes from './Component/ViewRecipes';
import CreateRecipe from './Component/CreateRecipe';
import EditRecipe from './Component/editRecipe';
import EditProfile from './Component/editProfile';
import UpdateRecipes from './Component/UpdateRecipes';
import About from './Component/About';
import Support from './Component/Support';
import AllUsers from './Component/AllUsers';
import AllChefs from './Component/AllChefs';
import AllRecipes from './Component/AllRecipes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { loginSuccess, logout } from './actions/authActions';
import { connect } from 'react-redux'; 
import { jwtDecode } from 'jwt-decode';

function App({ loggedIn, userType, loginSuccess, logout }) {
  useEffect(() => {
    document.title = "Recipe Hub";
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const user = decodedToken.user;
      const userType = user.role;
      // Check token expiry
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
      if (decodedToken.exp < currentTime) {
        console.log(decodedToken.exp)
        handleLogout();
      } else {
        // Token is valid, login user
        loginSuccess(token, userType);
      }
    }
  }, [loginSuccess]);

  const handleLogout = () => {
      localStorage.removeItem('token');
      logout();
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout isLoggedIn={loggedIn} handleLogout={handleLogout} />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/RecipeList" element={loggedIn && userType === "user" ?<RecipeList />:<Navigate to="/" />} />
          <Route path="/SavedRecipes" element={loggedIn && userType === "user"?<SavedRecipes />:<Navigate to="/" />} />
          <Route path="/Admin" element={loggedIn && userType === "admin"?<Admin />:<Navigate to="/" />} />
          <Route path="/User" element={loggedIn && userType === "user"?<User />:<Navigate to="/" />} />
          <Route path="/Chef" element={loggedIn && userType === "chef"?<Chef />:<Navigate to="/" />} />
          <Route path="/ViewRecipes" element={loggedIn?<ViewRecipes />:<Navigate to="/" />} />
          <Route path="/CreateRecipe" element={loggedIn && userType === "chef"?<CreateRecipe />:<Navigate to="/" />} />
          <Route path="/editProfile" element={loggedIn ?<EditProfile />:<Navigate to="/" />} />
          <Route path="/UpdateRecipes" element={loggedIn && userType === "chef"?<UpdateRecipes />:<Navigate to="/" />} />
          <Route path="/editRecipe/:id" element={loggedIn && userType === "chef"?<EditRecipe />:<Navigate to="/" />} />
          <Route path="/Support" element={loggedIn?<Support />:<Navigate to="/" />} />
          <Route path="/AllUsers" element={loggedIn && userType === "admin"?<AllUsers />:<Navigate to="/" />} />
          <Route path="/AllChefs" element={loggedIn && userType === "admin"?<AllChefs />:<Navigate to="/" />} />
          <Route path="/AllRecipes" element={loggedIn && userType === "admin"?<AllRecipes />:<Navigate to="/" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  userType: state.auth.userType
});

const mapDispatchToProps = {
  loginSuccess,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


