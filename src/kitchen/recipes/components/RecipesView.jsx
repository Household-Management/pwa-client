import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TextField, List, ListItemText, Typography, Container, Button, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

export default function RecipesView() {
    const recipes = useSelector((state) => state.kitchen.recipes.recipes);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    return (
        <Container>
            <List>
                {Object.values(recipes).map(recipe => (
                    <Button variant="outlined" key={recipe.id} onClick={() => handleRecipeClick(recipe)} fullWidth>
                        <ListItemText
                            primary={recipe.title}
                            secondary={recipe.description}
                        />
                    </Button>
                ))}
            </List>
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>{selectedRecipe?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="h6">Ingredients:</Typography>
                        <ul>
                            {selectedRecipe?.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
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
        </Container>
    );
}