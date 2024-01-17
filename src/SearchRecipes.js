import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from 'react-router-dom';

const SearchRecipes = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchRecipesCalled, setSearchRecipesCalled] = useState(false);

  const searchRecipes = async () => {
    console.log("is Searching");
    setIsSearching(true);

    console.log('Data to be sent: ', searchTerm);
    axios.post('http://localhost/search_recipes.php', {
      searchTerm,
    })
      .then((response) => {
        console.log('Successful response: XD', response.data);
        setSearchResults(response.data[0]);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        setIsSearching(false);
        setSearchRecipesCalled(true);
      });
  };

  const highlightSearchTerm = (text, term) => {
    if (text) {
      const regex = new RegExp(term, 'gi');
      return text.replace(regex, (match) => `<strong>${match}</strong>`);
    } else {
      return ''; // or handle it in a way that makes sense for your application
    }
  }

  return (
    <div>
      <h2>Search Recipes</h2>
      <div>
        <label>Search Term: </label>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type="button" onClick={searchRecipes} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      {searchRecipesCalled && (
        <div>
          <h3>Search Results:</h3>
          {searchResults && searchResults.length > 0 ? (
            <ul>
              {searchResults.map((recipe, index) => (
                <li key={index}>
                  <div key={index} className={`recipe-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    <strong>ID:</strong> <Link to={`/edit/${recipe.id}`}>{recipe.id}</Link><br/>
                    <strong>Title: </strong>
                    <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(recipe.title, searchTerm) }} /><br />
                    <strong>Ingredients: </strong>
                    <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(recipe.ingredients, searchTerm) }} /><br />
                    <strong>Instructions: </strong>
                    <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(recipe.instructions, searchTerm) }} />
                    {/* Add a link to EditRecipe.js with the recipe id */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recipes found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRecipes;