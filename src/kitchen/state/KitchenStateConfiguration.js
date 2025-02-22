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
        }),
        groceryLists: createSlice({
            name: "groceryLists",
            initialState: initialState && initialState.groceryLists ? initialState.groceryLists : {
                lists: []
            },
            reducers: {
                AddList: (state, action) => {
                    state.lists.push({ name: action.payload.name, items: [] });
                    return state;
                },
                RemoveList: (state, action) => {
                    state.lists = state.lists.filter(list => list.name !== action.payload);
                    return state;
                },
                AddListItem: (state, action) => {
                    const list = state.lists.find(list => list.name === action.payload.listName);
                    if (list) {
                        list.items.push({ name: action.payload.itemName, quantity: action.payload.quantity });
                    }
                    return state;
                },
                RemoveListItem: (state, action) => {
                    const list = state.lists.find(list => list.name === action.payload.listName);
                    if (list) {
                        list.items = list.items.filter(item => item.name !== action.payload.itemName);
                    }
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
