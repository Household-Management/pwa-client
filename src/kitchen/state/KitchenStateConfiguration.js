import {combineReducers, createSlice} from "@reduxjs/toolkit";

let slice = undefined;

export default function (initialState) {
    slice = {
        pantry: createSlice({
            name: "pantry",
            initialState: initialState && initialState.pantry ? initialState.pantry : {
                items: [],
                locations: ["Pantry", "Fridge", "Freezer"]
            },
            reducers: {
                AddItem: (state, action) => {
                    state.items.push(action.payload);
                    return state;
                },
                RemoveItem: (state, action) => {
                    state.items = state.items.filter(item => item.id !== action.payload);
                    return state;
                },
                AddLocation: (state, action) => {
                    state.locations.push(action.payload);
                    return state;
                },
                RemoveLocation: (state, action) => {
                    state.locations = state.locations.filter(location => location !== action.payload);
                    return state;
                }
            }
        })
    };

    return combineReducers(Object.keys(slice).reduce((acc, key) => {
        acc[key] = slice[key].reducer;
        actions[key] = slice[key].actions;
        return acc;
    }, {}));
}

export const actions = {}