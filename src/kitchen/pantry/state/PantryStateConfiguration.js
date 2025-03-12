import {createSlice} from "@reduxjs/toolkit";
const initialState = {
    items: [],
    locations: ["Pantry", "Fridge", "Freezer"]
}
const slice =  createSlice({
    name: "pantry",
    initialState,
    reducers: {
        AddPantryItem: (state, action) => {
            state.items.push({...action.payload, id: crypto.randomUUID()});
            return state;
        },
        RemovePantryItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            return state;
        },
        AddPantryLocation: (state, action) => {
            state.locations.push(action.payload);
            return state;
        },
        RemovePantryLocation: (state, action) => {
            state.locations = state.locations.filter(location => location !== action.payload);
            return state;
        }
    },
    extraReducers: builder => {
        builder.addMatcher(action => {
            return action.type === "LOADED_STATE";
        }, (state, action) => {
            return action?.payload?.pantry || initialState;
        })
    }
});

export default slice.reducer;