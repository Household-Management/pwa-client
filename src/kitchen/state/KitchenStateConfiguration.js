import {combineReducers, createSlice} from "@reduxjs/toolkit";

let slice = undefined;
// TODO: Add feature for saving locations of items at stores.
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
                    state.items.push({...action.payload, id: crypto.randomUUID()});
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
                    state.lists.push({ id: crypto.randomUUID(), name: action.payload.name, items: [] });
                    return state;
                },
                RemoveList: (state, action) => {
                    state.lists = state.lists.filter(list => list.id !== action.payload);
                    return state;
                },
                AddListItem: (state, action) => {
                    const list = state.lists.find(list => list.id === action.payload.listId);
                    if (list && action.payload.itemName.trim() !== "") {
                        list.items.push({ id: crypto.randomUUID(), name: action.payload.itemName.trim(), quantity: action.payload.quantity });
                    }
                    return state;
                },
                RemoveListItem: (state, action) => {
                    const list = state.lists.find(list => list.id === action.payload.listId);
                    if (list) {
                        list.items = list.items.filter(item => item.id !== action.payload.itemId);
                    }
                    return state;
                },
                ReplaceListItem: (state, action) => {
                    const list = state.lists.find(list => list.id === action.payload.listId && list.id !== undefined);
                    if (list) {
                        list.items = list.items.map(item => {
                            if (item.id === action.payload.item.id) {
                                return {...action.payload.item};
                            }
                            return item;
                        });
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
