import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    recipes: {}
}
export const slice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        addRecipe(state, action) {
            state.recipes[action.payload.id] = action.payload;
        },
        removeRecipe(state, action) {
            delete state.recipes[action.payload];
        },
        updateRecipe(state, action) {
            state.recipes[action.payload.id] = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addMatcher(action => {
            return action.type === "LOADED_STATE";
        }, (state, action) => {
            return action.payload?.kitchen?.recipes || initialState;
        })
    }
});

export const { addRecipe, removeRecipe, updateRecipe } = slice.actions;

export default slice.reducer;