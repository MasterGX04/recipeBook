import React, { useState, useEffect } from 'react';
import SearchRecipes from './SearchRecipes';
import AddRecipe from './AddRecipe';
import EditRecipe from './EditRecipe';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('/search');
  const [recipeToAdd, setRecipetoAdd] = useState({ title: '', ingredients: '', instructions: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setIsLoggedIn(true);
    setActiveTab('/search'); // Set the default tab to /search if the user is logged in
  } else if (window.location.pathname !== '/signup') {
    // Navigate to the login page only if the user is not logged in and not already on /signup
    navigate('/login');
  }
  }, [navigate, isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('user', 'loggedIn');
    navigate('/search');
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      setIsLoggedIn(false);
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Recipe App</h1>
      </div>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      ) : (
        <React.Fragment>
          <div className="tabs-section">
            <Link to="/search">
              <button
                onClick={() => handleTabChange('/search')}
                className={activeTab === '/search' ? 'active' : ''}
              >
                Search Recipes
              </button>
            </Link>
            <Link to="/add">
              <button
                onClick={() => handleTabChange('/add')}
                className={activeTab === '/add' ? 'active' : ''}
              >
                Add Recipes
              </button>
            </Link>
            <Link to="/edit/:recipeId">
              <button
                onClick={() => handleTabChange('/edit/:recipeId')}
                className={activeTab === '/edit/:recipeId' ? 'active' : ''}
              >
                Edit Recipes
              </button>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="content-section">
          <Routes>
              <Route path='/search' element={<SearchRecipes />} />
              <Route path='/add' element={<AddRecipe />} />
              <Route path='/edit/:recipeId' element={<EditRecipe />} />
            </Routes> 
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;