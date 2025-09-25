import {useState} from 'react';
import {useSelector} from 'react-redux';
import {
    List,
    ListItemText,
    Container,
    Button,
    Dialog,
    DialogTitle,
    DialogContent, ListItem,
} from '@mui/material';
import RecipeInformationView from "./RecipeInformationView";
import AppState from "../../../redux/AppState.ts";
import {RecipesState} from "../state/RecipesStateConfiguration.ts";
import RecipeModel from '../state/RecipeModel.ts';

export default function RecipesView() {
    const recipes: RecipesState = useSelector((state: AppState) => {
        return state.household.kitchen.recipes;
    });

    const [selectedRecipe, setSelectedRecipe] = useState<RecipeModel | null>(null);
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
            <Button variant="contained" onClick={() => true}>Add Recipe</Button>
            <List>
                {Object.values(recipes).map(recipe => (
                    <ListItem key={recipe.id} disablePadding>
                        <Button variant="outlined" onClick={() => handleRecipeClick(recipe)} fullWidth>
                            <ListItemText
                                primary={<span>{recipe.title}</span>}
                                secondary={`Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}`}
                            />
                        </Button>
                    </ListItem>
                ))}
            </List>
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>{selectedRecipe?.title || 'New Recipe'}</DialogTitle>

                <DialogContent>
                    {selectedRecipe && <RecipeInformationView recipe={selectedRecipe as RecipeModel}/> }
                </DialogContent>
                <Button onClick={handleCloseModal}>Close</Button>
            </Dialog>
        </Container>
    );
}