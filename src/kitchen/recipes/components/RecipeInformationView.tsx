import {
    Autocomplete,
    Button,
    IconButton,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import * as React from "react";
import RecipeModel from "../state/RecipeModel.ts";

const unitOptions = ['ounces', 'pounds', 'teaspoons', 'tablespoons', 'cups', 'grams', 'kilograms', 'liters', 'milliliters'];

const initialIngredientState = {name: '', quantity: 0, unit: ''};
const initialInstructionState = '';

const RecipeInformationView = function ({recipe, updateRecipe}: {
    recipe: RecipeModel,
    updateRecipe?: React.Dispatch<React.SetStateAction<RecipeModel>>
}) {
    const theme = useTheme();
    const onRecipeChange = (value) => {
        if (updateRecipe) {
            updateRecipe(value);
        }
    }
    const readOnly = !updateRecipe;
    const [newIngredient, setNewIngredient] = React.useState<{
        name: string,
        quantity: number,
        unit: string | null
    }>(initialIngredientState);
    const [newInstruction, setNewInstruction] = React.useState<string>(initialInstructionState);
    return <Stack spacing={2}>
        <ListItem>
            <TextField
                label="Title"
                variant="outlined"
                placeholder="New Recipe"
                fullWidth
                sx={{overflowY: 'visible'}}
                value={recipe.title}
                onChange={(e) => onRecipeChange({...recipe, title: e.target.value})}
            />
        </ListItem>
        <ListItem>
            <TextField
                label="Preparation Time"
                variant="outlined"
                fullWidth
                value={recipe.prepTime}
                onChange={(e) => onRecipeChange({...recipe, prepTime: e.target.value})}
            />
        </ListItem>
        {readOnly}
        <ListItem>
            <TextField
                label="Cook Time"
                variant="outlined"
                fullWidth
                value={recipe.cookTime}
                onChange={(e) => onRecipeChange({...recipe, cookTime: e.target.value})}
            />
        </ListItem>
        <Typography variant="h6">Ingredients:</Typography>
        <List>
            {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {backgroundColor: theme.palette.action.hover},
                    '&:has(:hover)': {backgroundColor: theme.palette.background.default}
                }}>
                    {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                    {!readOnly && <IconButton color="error" onClick={() => onRecipeChange({
                        ...recipe,
                        ingredients: recipe.ingredients.filter((_, i) => i !== index)
                    })}>
                        <Delete/>
                    </IconButton>}
                </ListItem>
            ))}
        </List>
        {!readOnly && <ListItem>
            <TextField
                label="Ingredient Name"
                variant="outlined"
                fullWidth
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
            />
            <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({...newIngredient, quantity: Number(e.target.value)})}
            />
            <Autocomplete
                options={unitOptions}
                value={newIngredient.unit}
                onChange={(_e, newValue) => setNewIngredient({...newIngredient, unit: newValue})}
                renderInput={(params) => <TextField {...params} label="Unit" variant="outlined" fullWidth/>}
            />
            <Button color="primary" onClick={() => {
                updateRecipe({...recipe, ingredients: [...recipe.ingredients, newIngredient]})
                setNewIngredient(initialIngredientState)
            }} variant="contained">
                <AddIcon/>
            </Button>
        </ListItem>}
        <Typography variant="h6">Instructions:</Typography>
        <List>
            {recipe.instructions?.map((instruction, index) => (
                <ListItem key={index} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {backgroundColor: theme.palette.action.hover},
                    '&:has(:hover)': {backgroundColor: theme.palette.background.default}
                }}>
                    {`${instruction}`}
                    {!readOnly && <IconButton color="error" onClick={() => onRecipeChange({
                        ...recipe,
                        instructions: recipe.instructions?.filter((_, i) => i !== index)
                    })}
                                              onMouseEnter={e => e.stopPropagation()}
                    >
                        <Delete/>
                    </IconButton>}
                </ListItem>
            ))}
        </List>
        {!readOnly && <ListItem>
            <TextField
                label="New Instruction"
                variant="outlined"
                fullWidth
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
            />
            <Button color="primary" onClick={() => {
                updateRecipe({...recipe, instructions: [...(recipe?.instructions || []), newInstruction]})
                setNewInstruction("");
            }} variant="contained">
                <AddIcon/>
            </Button>
        </ListItem>}
    </Stack>
}

export default RecipeInformationView;