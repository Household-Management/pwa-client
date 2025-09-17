import {createSlice} from "@reduxjs/toolkit";
import * as _ from "lodash";

const initialState = {
    items: [],
    locations: ["Pantry", "Fridge", "Freezer"]
};

async function PersistNewPantryItem(client, item) {
    const created = await client.models.PantryItem.create(item);
    if (created.errors) {
        throw new Error(created.errors.join(", "));
    }
    return created;
}

async function PersistUpdatedPantryItem(client, item) {
    const updated = await client.models.PantryItem.update(item);
    if (updated.errors) {
        throw new Error(updated.errors);
    }
}

async function PersistPantryItem(client, state, action) {
    const item = state.household.kitchen.pantry.items.find(i => i.id === action.payload.id);
    if (item) {
        if(item.id) {
            await PersistUpdatedPantryItem(client, item);
        } else {
            await PersistNewPantryItem(client, {...item,
                id: crypto.randomUUID(),
                pantryId : state.household.kitchen.pantry.id,
                membersGroup: [`members:${state.household.id}`],
                adminGroup: [`admin:${state.household.id}`]
            });
        }
    } else {
        throw new Error("Item not found: " + JSON.stringify(action.payload.id));
    }
}

async function PersistPantryLocation(client, state, action) {
    const location = action.payload;
    if (location) {
        const updated = await client.models.PantryLocation.update({name: location});
        if (updated.errors) {
            throw new Error(updated.errors);
        }
    }
}

async function DeletePantryItem(client, state, action) {
    const itemId = action.payload;
    const deleted = await client.models.PantryItem.delete({id: action.payload});
    if (deleted.errors) {
        throw new Error(deleted.errors.join(", "));
    }
}

const slice = createSlice({
    name: "pantry",
    initialState,
    reducers: {
        AddPantryItem: {
            reducer: (state, action) => {
                state.items.push({...action.payload });
                return state;
            },
            prepare: (payload) => ({
                payload,
                meta: {
                    persister: PersistPantryItem
                }
            })
        },
        UpdatePantryItem: {
            reducer: (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = {...state.items[index], ...action.payload};
                }
                return state;
            },
            prepare: (payload) => ({
                payload,
                meta: {
                    persister: PersistPantryItem
                }
            })
        },
        RemovePantryItem: {
            reducer: (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                return state;
            },
            prepare: (payload) => ({
                payload,
                meta: {
                    persister: DeletePantryItem
                }
            })
        },
        AddPantryLocation: {
            reducer: (state, action) => {
                state.locations.push(action.payload);
                return state;
            },
            prepare: (payload) => ({
                payload,
                meta: {
                    persister: PersistPantryLocation
                }
            })
        },
        RemovePantryLocation: {
            reducer: (state, action) => {
                state.locations = state.locations.filter(location => location !== action.payload);
                return state;
            },
            prepare: (payload) => ({
                payload,
                meta: {
                    persister: PersistPantryLocation
                }
            })
        }
    },
    extraReducers: builder => {
        builder.addMatcher(action => action.type === "LOADED_STATE", (state, action) => {
            return _.merge(action?.payload?.kitchen.pantry || {},  initialState);
        });
    }
});

export const {
    AddPantryItem,
    RemovePantryItem,
    AddPantryLocation,
    RemovePantryLocation,
    UpdatePantryItem
} = slice.actions;

export default slice.reducer;