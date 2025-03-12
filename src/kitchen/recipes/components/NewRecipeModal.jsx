// src/kitchen/recipes/components/NewRecipeModal.jsx
import React, { useState } from 'react';
import {
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    ListItem,
    IconButton,
    Autocomplete,
    Button,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const unitOptions = ['ounces', 'pounds', 'teaspoons', 'tablespoons', 'cups', 'grams', 'kilograms', 'liters', 'milliliters'];

export default function NewRecipeModal({ isOpen, onClose, onAddRecipe }) {
    const [newRecipe, setNewRecipe] = useState({ title: '', ingredients: [], instructions: [], prepTime: '', cookTime: '' });
    const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '' });
    const [newInstruction, setNewInstruction] = useState('');

    const handleAddIngredient = () => {
        if (newIngredient.name.trim()) {
            setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, { ...newIngredient }] });
            setNewIngredient({ name: '', quantity: '', unit: '' });
        }
    };

    const handleAddInstruction = () => {
        if (newInstruction.trim()) {
            setNewRecipe({ ...newRecipe, instructions: [...newRecipe.instructions, newInstruction.trim()] });
            setNewInstruction('');
        }
    };

    const handleAddRecipe = () => {
        onAddRecipe(newRecipe);
        setNewRecipe({ title: '', ingredients: [], instructions: [], prepTime: '', cookTime: '' });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Recipe</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <ListItem>
                        <TextField
                            label="Title"
                            variant="outlined"
                            placeholder="New Recipe"
                            fullWidth
                            sx={{ overflowY: 'visible' }}
                            value={newRecipe.title}
                            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Preparation Time"
                            variant="outlined"
                            fullWidth
                            value={newRecipe.prepTime}
                            onChange={(e) => setNewRecipe({ ...newRecipe, prepTime: e.target.value })}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Cook Time"
                            variant="outlined"
                            fullWidth
                            value={newRecipe.cookTime}
                            onChange={(e) => setNewRecipe({ ...newRecipe, cookTime: e.target.value })}
                        />
                    </ListItem>
                    <Typography variant="h6">Ingredients:</Typography>
                    <ul>
                        {newRecipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</li>
                        ))}
                    </ul>
                    <ListItem>
                        <TextField
                            label="Ingredient Name"
                            variant="outlined"
                            fullWidth
                            value={newIngredient.name}
                            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            fullWidth
                            value={newIngredient.quantity}
                            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                        />
                        <Autocomplete
                            options={unitOptions}
                            value={newIngredient.unit}
                            onChange={(e, newValue) => setNewIngredient({ ...newIngredient, unit: newValue })}
                            renderInput={(params) => <TextField {...params} label="Unit" variant="outlined" fullWidth />}
                        />
                        <IconButton color="primary" onClick={handleAddIngredient}>
                            <AddIcon />
                        </IconButton>
                    </ListItem>
                    <Typography variant="h6">Instructions:</Typography>
                    <ol>
                        {newRecipe.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                    <ListItem>
                        <TextField
                            label="New Instruction"
                            variant="outlined"
                            fullWidth
                            value={newInstruction}
                            onChange={(e) => setNewInstruction(e.target.value)}
                        />
                        <IconButton color="primary" variant="contained" onClick={handleAddInstruction}>
                            <AddIcon />
                        </IconButton>
                    </ListItem>
                </Stack>
            </DialogContent>
            <Button onClick={handleAddRecipe}>Add Recipe</Button>
        </Dialog>
    );
}