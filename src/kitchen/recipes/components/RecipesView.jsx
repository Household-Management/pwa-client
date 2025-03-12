import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    List,
    ListItemText,
    Typography,
    Container,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText
} from '@mui/material';
import { addRecipe } from '../state/RecipesStateConfiguration';
import NewRecipeModal from './NewRecipeModal';

export default function RecipesView() {
    const recipes = useSelector((state) => state.kitchen.recipes.recipes);
    const dispatch = useDispatch();
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    const handleAddRecipe = (newRecipe) => {
        dispatch(addRecipe({ ...newRecipe, id: Date.now() }));
        setIsAddModalOpen(false);
    };

    return (
        <Container>
            <Button variant="contained" onClick={() => setIsAddModalOpen(true)}>Add Recipe</Button>
            <List>
                {Object.values(recipes).map(recipe => (
                    <Button variant="outlined" key={recipe.id} onClick={() => handleRecipeClick(recipe)} fullWidth>
                        <ListItemText
                            primary={recipe.title}
                            secondary={`Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}`}
                        />
                    </Button>
                ))}
            </List>
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>{selectedRecipe?.title || 'New Recipe'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="h6">Ingredients:</Typography>
                        <ul>
                            {selectedRecipe?.ingredients.map((ingredient, index) => (
                                <li key={index}>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</li>
                            ))}
                        </ul>
                        <Typography variant="h6">Instructions:</Typography>
                        <ol>
                            {selectedRecipe?.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    </DialogContentText>
                </DialogContent>
                <Button onClick={handleCloseModal}>Close</Button>
            </Dialog>
            <NewRecipeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddRecipe={handleAddRecipe}
            />
        </Container>
    );
}