import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const AddRecipe = () => {
  const [title] = useState('');
  const [ingredients] = useState('');
  const [instructions] = useState('');
  const isSubmittingRef = useRef(false);
  const [confirmation, setConfirmation] = useState('');
  const [errorMessages, setErrorMessages] = useState([{}]);
  const [recipeFields, setRecipeFields] = useState([{ title: '', ingredients: '', instructions: '' }]);
  //Accumulation of recipes added
  const [totalRecipes, setTotalRecipes] = useState([]);

  const handleAddField = () => {
    setRecipeFields([...recipeFields, { title: '', ingredients: '', instructions: '' }]);
    setErrorMessages((prevErrorMessages) => [...prevErrorMessages, {}]);
  }

  const handleInputChange = (index, name, value) => {
    const updatedFields = [...recipeFields];
    updatedFields[index][name] = value;
    setRecipeFields(updatedFields);
  };

  //Removes a field if user clicks on 'Delete Field"
  const handleDeleteField = (index) => {
    const updatedFields = [...recipeFields];
    const updatedErrors = [...errorMessages];
    
    updatedFields.splice(index, 1);
    updatedErrors.splice(index, 1);

    setRecipeFields(updatedFields);
    setErrorMessages(updatedErrors);
  };

  const handleAddRecipe = () => {
    const accumulatedRecipes = [];
    let hasError = false;

    //Clone errors array
    const newErrorMessages = [...errorMessages];

    //Loops through each field
    recipeFields.forEach((recipe, index) => {
      const fieldErrors = {};

      // Check if each field is filled before submission
      if (!recipe.title.trim()) {
        fieldErrors.title = 'Title cannot be empty';
        hasError = true;
      }

      if (!recipe.ingredients.trim()) {
        fieldErrors.ingredients = 'Ingredients cannot be empty';
        hasError = true;
      }

      if (!recipe.instructions.trim()) {
        fieldErrors.instructions = 'Instructions cannot be empty';
        hasError = true;
      }

      // If a single field has an error, add it to the fieldErrors object
      if (Object.keys(fieldErrors).length > 0) {
        newErrorMessages[index] = fieldErrors;
      } else {
        accumulatedRecipes.push(recipe);
        newErrorMessages[index] = {}; // Reset the error messages for this field
      }
    });

    console.log('New Error Messages:', newErrorMessages); // Add this log statement


    if (hasError) {
      setErrorMessages(newErrorMessages);
      return;
    }

    accumulatedRecipes.forEach((recipe) => {
      addRecipe(recipe);
    });

    setTotalRecipes([...totalRecipes, ...accumulatedRecipes]);
    setRecipeFields([{ title: '', ingredients: '', instructions: '' }]);
  };

  const addRecipe = (recipe) => {
    isSubmittingRef.current = true;
    console.log('Data to be sent:', { title, ingredients, instructions });
    axios
      .post('http://localhost/add_recipe.php', {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      })
      .then((response) => {
        console.log('Successful response:', response.data);
        setConfirmation('Recipe added successfully!');
      })
      .catch((error) => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        isSubmittingRef.current = false;
      });
  };

  return (
    <div>
      <h2>Add Recipe</h2>
      {recipeFields.map((recipe, index) => (
        <form key={index} className={`recipe-item ${index % 2 === 0 ? 'even' : 'odd'}`}>
          <div/>

          <label>Title: </label>
          <input type="text"
            name={`title-${index}`}  // Make sure name is unique 
            value={recipe.title}
            onChange={(e) => handleInputChange(index, 'title', e.target.value)} />
          <p style={{ color: 'red' }}>{errorMessages[index]?.title}</p>

          <label>Ingredients: </label>
          <textarea
            value={recipe.ingredients}
            name={`ingredients-${index}`}
            onChange={(e) => handleInputChange(index, 'ingredients', e.target.value)}></textarea>
          <p style={{ color: 'red' }}>{errorMessages[index]?.ingredients}</p>
        
          <label>Instructions: </label>
          <textarea
            value={recipe.instructions}
            name={`instructions-${index}`}
            onChange={(e) => handleInputChange(index, 'instructions', e.target.value)}></textarea>
          <p style={{ color: 'red' }}>{errorMessages[index]?.instructions}</p>

          {recipeFields.length > 1 && (
            <button type="button" onClick={() => handleDeleteField(index)}>
              Remove This Field
            </button>
          )}

          {index === recipeFields.length - 1 && (
            <>
              <button type="button" onClick={handleAddField}>Add Another Field</button>
              <button type="button" onClick={handleAddRecipe} disabled={isSubmittingRef.current}>
                Add Recipe
              </button>
            </>
          )}

          {confirmation && <p>{confirmation}</p>}
        </form>
      ))}
    </div>

  );
};

export default AddRecipe;