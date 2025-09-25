import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
} from '@mui/material';
// TODO: Remove, not used anywhere
export default function RecipeInformationModal({ isOpen, onClose, onAddRecipe }) {
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

            </DialogContent>
            <Button onClick={handleAddRecipe}>Add Recipe</Button>
        </Dialog>
    );
}