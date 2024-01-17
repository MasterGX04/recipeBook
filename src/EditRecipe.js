import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditRecipe = () => {
    const { recipeId: urlRecipeId } = useParams();
    const [recipeId, setRecipeId] = useState(urlRecipeId === ':recipeId' ? '' : urlRecipeId || '');
    const [recipe, setRecipe] = useState([]);
    const [editedRecipe, setEditedRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
    });
    const [isSearching, setIsSearching] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        title: '',
        ingredients: '',
        instructions: '',
    });

    useEffect(() => {
        if (urlRecipeId) {
            // Fetch details only if recipeId is available in the URL parameters
            getRecipeDetails();
        }
    }, [urlRecipeId]);

    const getRecipeDetails = async () => {
        if (urlRecipeId === ':recipeId') {
            return;
        }
        
        setIsSearching(true);

        axios.post('http://localhost:80/get_recipe.php', {
            recipeId,
        })
            .then((response) => {
                console.log('Successful response:', response.data);
                setRecipe(response.data || []);
                setEditedRecipe(response.data || []);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            })
            .finally(() => {
                setIsSearching(false);
            });
    }
    const handleInputChange = (field, value) => {
        setEditedRecipe((prevRecipe) => ({ ...prevRecipe, [field]: value }));
        console.log('Edited Recipe: ', editedRecipe);
    };


    const handleEditRecipe = async () => {
        // Validate input fields
        let hasError = false;
        // Reset error messages
        setErrorMessages({
            title: '',
            ingredients: '',
            instructions: '',
        });

        if (!editedRecipe.title.trim()) {
            setErrorMessages((prevErrors) => ({ ...prevErrors, title: 'Title cannot be empty' }));
            hasError = true;
        }

        if (!editedRecipe.ingredients.trim()) {
            setErrorMessages((prevErrors) => ({ ...prevErrors, ingredients: 'Ingredients cannot be empty' }));
            hasError = true;
        }

        if (!editedRecipe.instructions.trim()) {
            setErrorMessages((prevErrors) => ({ ...prevErrors, instructions: 'Instructions cannot be empty' }));
            hasError = true;
        }

        // If any field is empty, stop processing
        if (hasError) {
            return;
        }

        setIsSearching(true);

        axios.post('http://localhost:80/edit_recipe.php', {
            id: recipeId,
            title: editedRecipe.title,
            ingredients: editedRecipe.ingredients,
            instructions: editedRecipe.instructions,
        })
            .then((response) => {
                console.log('Successful response:', response.data)
                getRecipeDetails();
            })
            .catch((error) => {
                console.error('There was an error!', error);
            })
            .finally(() => {
                setIsSearching(false);
            });
    }

    //Asks recipe table to delete a recipe
    const handleDeleteRecipe = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');

        if (!confirmDelete) {
            return;
        }

        setIsSearching(true);
        axios.post('http://localhost:80/delete_recipe.php', {
            id: recipeId,
        })
            .then((response) => {
                console.log('Successful delete response:', response.data);
            }).finally(() => {
                setIsSearching(false);
                setRecipe({});
            });
    };

    return (
        <div>
            <h2>Edit Recipe</h2>
            <div>
                <label>Recipe ID: </label>
                <input
                    type="text"
                    value={recipeId}
                    onChange={(e) => setRecipeId(e.target.value)}
                />
                <button type="button" onClick={getRecipeDetails} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Get Recipe Details'}
                </button>
            </div>
            {Object.keys(recipe).length > 0 && (
                <div>
                    <h3>Recipe Details:</h3>
                    <div>
                        <label><strong>Title:</strong></label>
                        <div>{recipe.title}</div>

                        <label><strong>Ingredients:</strong></label>
                        <div>{recipe.ingredients}</div>

                        <label><strong>Instructions:</strong></label>
                        <div>{recipe.instructions}</div>
                    </div>
                    <form>
                        <label>Title: </label>
                        <input
                            type="text"
                            value={editedRecipe.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                        <p style={{ color: 'red' }}>{errorMessages.title}</p>

                        <label>Instructions: </label>
                        <textarea
                            value={editedRecipe.ingredients}
                            onChange={(e) => handleInputChange('ingredients', e.target.value)}
                        ></textarea>
                        <p style={{ color: 'red' }}>{errorMessages.ingredients}</p>

                        <label>Instructions:</label>
                        <textarea
                            value={editedRecipe.instructions}
                            onChange={(e) => handleInputChange('instructions', e.target.value)}
                        ></textarea>
                        <p style={{ color: 'red' }}>{errorMessages.instructions}</p>

                        <button type="button" onClick={handleEditRecipe} disabled={isSearching}>
                            Save Changes
                        </button>
                        <button type="button" onClick={handleDeleteRecipe} disabled={isSearching}>
                            Delete Recipe
                        </button>
                    </form>
                </div>
            )}
        </div>


    );
};

export default EditRecipe;