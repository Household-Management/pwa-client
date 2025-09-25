import {useState} from 'react';
import RecipeInformationView from './RecipeInformationView';
import RecipeModel from '../state/RecipeModel';
import {Dialog, DialogContent} from "@mui/material";

export default {
    title: 'Kitchen/RecipeInformationView',
    component: RecipeInformationView,
};

const Template = (args) => {
    const [recipe, setRecipe] = useState<RecipeModel>(args.recipe);
    if (args.modal) {
        return <Dialog open={true}>
            <DialogContent>
                <RecipeInformationView recipe={recipe} updateRecipe={args.readonly ? undefined : setRecipe}/>;
            </DialogContent>
        </Dialog>
    } else {
        return <RecipeInformationView recipe={recipe} updateRecipe={args.readonly ? undefined : setRecipe}/>;
    }
};

export const Default = Template.bind({});
// @ts-ignore
Default.args = {
    modal: true,
    readonly: false,
    recipe: {
        id: '1',
        title: 'Spaghetti Bolognese',
        prepTime: '15 mins',
        cookTime: '30 mins',
        ingredients: [
            {name: 'Spaghetti', quantity: 200, unit: 'grams'},
            {name: 'Ground Beef', quantity: 300, unit: 'grams'},
            {name: 'Tomato Sauce', quantity: 1, unit: 'cup'},
        ],
        instructions: [
            'Boil spaghetti according to package instructions.',
            'Cook ground beef in a pan until browned.',
            'Add tomato sauce to the beef and simmer for 10 minutes.',
            'Serve the sauce over the spaghetti.',
        ],
    },
};