import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    lists: [
        {
            id: "1",
            name: "Groceries",
            items: []
        }
    ]
}

const slice = createSlice({
    name: "groceries",
    initialState,
    reducers: {
        AddGroceryList: (state, action) => {
            state.lists.push({id: crypto.randomUUID(), name: action.payload.name, items: []});
            return state;
        },
        RemoveGroceryList: (state, action) => {
            state.lists = state.lists.filter(list => list.id !== action.payload);
            return state;
        },
        AddGroceryListItem: (state, action) => {
            const list = state.lists.find(list => list.id === action.payload.listId);
            if (list && action.payload.itemName.trim() !== "") {
                list.items.push({
                    id: crypto.randomUUID(),
                    location: action.payload.location,
                    name: action.payload.itemName.trim(),
                    quantity: action.payload.quantity
                });
            }
            return state;
        },
        RemoveGroceryListItem: (state, action) => {
            const list = state.lists.find(list => list.id === action.payload.listId);
            if (list) {
                list.items = list.items.filter(item => item.id !== action.payload.itemId);
            }
            return state;
        },
        ReplaceGroceryListItem: (state, action) => {
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
    },
    extraReducers: builder => {
        builder.addMatcher(action => {
            return action.type === "LOADED_STATE";
        }, (state, action) => {
            return action?.payload?.groceries || initialState;
        })
    }
});

export const {
    AddGroceryList,
    RemoveGroceryList,
    AddGroceryListItem,
    RemoveGroceryListItem,
    ReplaceGroceryListItem
} = slice.actions;

export default slice.reducer;