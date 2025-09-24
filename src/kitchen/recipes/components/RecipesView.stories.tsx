import {Provider} from 'react-redux';
import {combineReducers, combineSlices, configureStore} from '@reduxjs/toolkit';
import RecipesView from './RecipesView';
import recipesReducer from '../state/RecipesStateConfiguration';

const mockStore = configureStore({
        reducer: combineReducers({
            kitchen: combineSlices({
                recipes: recipesReducer
            })
        }),
        preloadedState: {
            kitchen: {
                recipes: {
                    1: {
                        id: 1,
                        title: 'Spaghetti Bolognese',
                        prepTime: '15 mins',
                        cookTime: '30 mins',
                        ingredients: [
                            {quantity: 200, unit: 'g', name: 'Spaghetti'},
                            {quantity: 100, unit: 'g', name: 'Minced Meat'},
                            {quantity: 1, unit: 'cup', name: 'Tomato Sauce'},
                        ],
                        instructions: [
                            'Boil spaghetti.',
                            'Cook minced meat.',
                            'Mix with tomato sauce.',
                        ],
                    },
                    2: {
                        id: 2,
                        title: 'Caesar Salad',
                        prepTime: '10 mins',
                        cookTime: '0 mins',
                        ingredients: [
                            {quantity: 1, unit: 'head', name: 'Romaine Lettuce'},
                            {quantity: 50, unit: 'g', name: 'Croutons'},
                            {quantity: 30, unit: 'ml', name: 'Caesar Dressing'},
                        ],
                        instructions: [
                            'Chop lettuce.',
                            'Add croutons and dressing.',
                            'Toss salad.',
                        ],
                    },
                },
            },
        },
    }
);

export default {
    title: 'Kitchen/RecipesView',
    // component: RecipesView,
};

export const Default = () => (
    <Provider store={mockStore}>
        <RecipesView/>
    </Provider>
);