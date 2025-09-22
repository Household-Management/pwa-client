import {createSlice, PrepareAction, UnknownAction} from "@reduxjs/toolkit";
import _ from "lodash";
import Client from "../../../data/AmplifyClient.ts";
import type {Schema} from "../../../../amplify/data/resource.ts";
import {Persister} from "../../../redux/Persister.ts";

export type PantryItemModel = Schema["PantryItem"]["type"];
export type ItemDataModel = Schema["ItemData"]["type"];
export type NutritionModel = ItemDataModel["nutrition"];

export type ItemDataInput = Parameters<typeof Client.models.ItemData.create>[0];
export type PantryItemInput = Parameters<typeof Client.models.PantryItem.create>[0];

const initialState = {
    items: [] as PantryItemModel[],
    locations: ["Pantry", "Fridge", "Freezer"]
};

async function PersistNewPantryItem(client, item: ItemDataInput, relationship: PantryItemInput) {
    const createdItem = await client.models.ItemData.create(item);
    const createRelationship = await client.models.PantryItem.create(relationship)
    if (createdItem.errors) {
        throw new Error(createdItem.errors.join(", "));
    }

    if (createRelationship.errors) {
        throw new Error(createRelationship.errors.join(", "));
    }
    return createdItem;
}

async function PersistUpdatedPantryItem(client, item) {
    const updated = await client.models.PantryItem.update(item);
    if (updated.errors) {
        throw new Error(updated.errors);
    }
}

const PersistPantryItem: Persister = async (client, state, action) => {
    const item = state.household.kitchen.pantry.items.find(i => i.id === action.payload.id);
    if (item) {
        if (item.id) {
            await PersistUpdatedPantryItem(client, item);
        } else {
            const itemId = crypto.randomUUID();
            await PersistNewPantryItem(client, {
                name: item.name as "string",
                nutrition: item.nutrition as object,
                id: itemId
            }, {
                id: crypto.randomUUID(),
                pantryId: state.household.kitchen.pantry.id,
                itemDataId: itemId,
                location: item.location,
                membersGroup: [`members:${state.household.id}`],
                adminGroup: [`admin:${state.household.id}`]
            });
        }
    } else {
        throw new Error("Item not found: " + JSON.stringify(action.payload.id));
    }
}

const DeletePantryItem: Persister = async (client, _state, action) => {
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
                state.items.push({...action.payload});
                return state;
            },
            prepare: (payload: PrepareAction<[ItemDataInput, PantryItemInput]>) => ({
                payload,
                meta: {
                    persister: PersistPantryItem
                },
                error: undefined
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
                },
                error: undefined
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
                },
                error: undefined
            })
        }
    },
    extraReducers: builder => {
        builder.addMatcher(action => action.type === "LOADED_STATE", (_state, action: UnknownAction & {
            payload: any
        }) => {
            return _.merge(action?.payload?.kitchen.pantry || {}, initialState);
        });
    }
});

export const {
    AddPantryItem,
    RemovePantryItem,
    UpdatePantryItem
} = slice.actions;

export default slice.reducer;

export type PantryState = {
    id: string,
    items: PantryItemModel[],
    locations: string[]
}