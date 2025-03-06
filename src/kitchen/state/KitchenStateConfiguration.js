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
        groceries: createSlice({
            name: "groceries",
            initialState: initialState && initialState.groceries ? initialState.groceries : {
                lists: [
                    {
                        id: "1",
                        name: "Groceries",
                        items: []
                    }
                ]
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
                        list.items.push({ id: crypto.randomUUID(), location:action.payload.location, name: action.payload.itemName.trim(), quantity: action.payload.quantity });
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

// export const schemaModel = {
//     Kitchen: a.model({
//         id: a.id(),
//         pantry: a.hasOne("Pantry", "id"),
//         groceries: a.hasOne("Groceries", "id")
//     }).authorization(allow => [allow.owner().to(["read"])]),
//     Pantry: a.model({
//         id: a.id(),
//         items: a.hasMany("PantryItem", "id"),
//         kitchen: a.belongsTo("Kitchen", "id")
//     }).authorization(allow => [allow.owner().to(["create", "read", "update"])]),
//     PantryItem: a.model({
//         id: a.id(),
//         name: a.string().required(),
//         location: a.string(),
//         quantity: a.integer().required(),
//         pantry: a.belongsTo("Pantry", "id")
//     }).authorization(allow => [allow.owner().to(["create", "read", "update"])]),
//     Groceries: a.model({
//         id: a.id(),
//         lists: a.hasMany("GroceryList", "id"),
//         kitchen: a.belongsTo("Kitchen", "id")
//     }).authorization(allow => [allow.owner().to(["create", "read", "update"])]),
//     GroceryList: a.model({
//         id: a.string().required(),
//         name: a.string().required(),
//         items: a.hasMany("GroceryItem", "id"),
//         groceries: a.belongsTo("Groceries", "id")
//     }).authorization(allow => [allow.owner().to(["create", "read", "update"])]),
//     GroceryItem: a.model({
//         id: a.string().required(),
//         name: a.string().required(),
//         quantity: a.integer().required(),
//         groceryList: a.belongsTo("GroceryList", "id")
//     }).authorization(allow => [allow.owner().to(["create", "read", "update"])]),
// }