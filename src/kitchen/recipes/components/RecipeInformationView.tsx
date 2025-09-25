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

const unitOptions = ['oz', 'lb', 'tsp', 'tbsp', 'cup', 'g', 'kg', 'l', 'ml'];

const initialIngredientState = {name: '', quantity: 1, unit: ''};
const initialInstructionState = '';

//TODO: Allow editing of instructions and ingredients
//TODO: Allow reordering of instructions and ingredients
const RecipeInformationView = function ({recipe, updateRecipe, fetchPantryIngredients}: {
    recipe: RecipeModel,
    updateRecipe?: React.Dispatch<React.SetStateAction<RecipeModel | null>>,
    fetchPantryIngredients?: () => Promise<string[]>
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
    const [pantryIngredients, setPantryIngredients] = React.useState<string[]>([]);
    React.useEffect(() => {
        // Abstract out fetching pantry so the fetching logic can be defined elsewhere
        if (fetchPantryIngredients) {
            fetchPantryIngredients().then(setPantryIngredients);
        }
    }, [fetchPantryIngredients])
    return <Stack spacing={2}>
        <ListItem>
            <TextField
                label="Title"
                variant="outlined"
                placeholder="New Recipe"
                fullWidth
                sx={{overflowY: 'visible'}}
                value={recipe.name}
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
            <Stack direction="row" spacing={1}>
                <Autocomplete options={pantryIngredients}
                              sx={{flexGrow: 3, minWidth: 200}}
                              renderInput={(params) => <TextField
                                  {...params}
                                  label="Ingredient Name"
                                  variant="outlined"
                                  fullWidth
                                  value={newIngredient.name}
                              />}
                              onChange={(_e, value) => setNewIngredient({...newIngredient, name: (value !== null ? value : '') as string})}
                />

                <TextField
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    sx={{flexGrow: 1, minWidth: 100}}
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: Number(e.target.value)})}
                />
                <Autocomplete
                    freeSolo
                    options={unitOptions}
                    sx={{flexGrow: 2, minWidth: 100}}
                    value={newIngredient.unit}
                    onChange={(_e, newValue) => setNewIngredient({...newIngredient, unit: newValue})}
                    renderInput={(params) => <TextField {...params} label="Unit" variant="outlined" fullWidth/>}
                />
                <div>
                    <Button sx={{height: "100%"}} color="primary" onClick={() => {
                        onRecipeChange({...recipe, ingredients: [...recipe.ingredients, newIngredient]})
                        setNewIngredient(initialIngredientState)
                    }} variant="contained">
                        <AddIcon/>
                    </Button>
                </div>
            </Stack>
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
            <Stack direction="row" spacing={1} sx={{width: '100%'}}>
                <TextField
                    label="Add Instruction"
                    variant="outlined"
                    fullWidth
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                />
                <div>
                    <Button color="primary"
                            sx={{height: "100%"}}
                            onClick={() => {
                                updateRecipe({
                                    ...recipe,
                                    instructions: [...(recipe?.instructions || []), newInstruction]
                                })
                                setNewInstruction("");
                            }} variant="contained">
                        <AddIcon/>
                    </Button>
                </div>
            </Stack>
        </ListItem>}
    </Stack>
}

export default RecipeInformationView;