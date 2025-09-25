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
    const pantry = useSelector((state: AppState) => {
        return state.household.kitchen.pantry;
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
            <Button variant="contained" onClick={() => {
                setIsModalOpen(true)
                setSelectedRecipe({
                    id: crypto.randomUUID(),
                    name: '',
                    instructions: [],
                    ingredients: [],
                })
            }}>Add Recipe</Button>
            <List>
                {Object.values(recipes).map(recipe => (
                    <ListItem key={recipe.id} disablePadding>
                        <Button variant="outlined" onClick={() => handleRecipeClick(recipe)} fullWidth>
                            <ListItemText
                                primary={<span>{recipe.name}</span>}
                                secondary={`Prep Time: ${recipe.prepTime} | Cook Time: ${recipe.cookTime}`}
                            />
                        </Button>
                    </ListItem>
                ))}
            </List>
            <Dialog open={isModalOpen} onClose={handleCloseModal} sx={{minWidth: "60%"}}>
                <DialogTitle>{selectedRecipe?.name || 'New Recipe'}</DialogTitle>

                <DialogContent>
                    {selectedRecipe && <RecipeInformationView recipe={selectedRecipe as RecipeModel} fetchPantryIngredients={async () => {
                        return pantry.items.map(_ => _.item.name).slice(0, 50);
                    }} updateRecipe={setSelectedRecipe}
                    /> }
                </DialogContent>
                <Button onClick={handleCloseModal}>Close</Button>
            </Dialog>
        </Container>
    );
}