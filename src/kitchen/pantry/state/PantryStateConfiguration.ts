import {createSlice, PayloadAction, UnknownAction} from "@reduxjs/toolkit";
import _ from "lodash";
import Client from "../../../data/AmplifyClient.ts";
import {Persister} from "../../../redux/Persister.ts";

// FIXME: I don't want to have to synchronize with the Amplify models manually, but Amplify uses a lot of magic under
//  the hood that I don't want to sift through right now.
/**
 * A runtime type representing a pantry item, which includes both the item data and its state within the pantry.
 */
export type PantryItem = {
    item: ItemDataModel,
    state: PantryItemModel
}

/**
 * A type representing the state of the pantry, including the list of items and their locations.
 */
export type PantryState = {
    items: PantryItem[],
    locations: string[],
    id?: string
}

export interface ItemDataModel {
    [index: string]: any;
    id?: string;
    name: string;
    nutrition?: {
        calories?: number;
        protein?: number;
        fat?: number;
        carbohydrates?: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
        servingSize?: string;
    };
    pantryItemLinks?: PantryItemModel[];
};

export interface PantryItemModel {
    [index: string]: any;
    pantryId: string;
    pantry?: {
        id: string;
        locations?: string[];
    };
    itemDataId?: string;
    itemData?: ItemDataModel;
    location?: string;
    quantity?: number;
    units?: string;
    expiration?: string;
    membersGroup?: string[];
    adminGroup?: string[];
};

const initialState: PantryState = {
    items: [] as PantryItem[],
    locations: ["Pantry", "Fridge", "Freezer"]
};

async function PersistNewPantryItem(client: typeof Client, item: ItemDataModel, relationship: PantryItemModel) {
    const createdItem = await client.models.ItemData.create(item);
    if (createdItem.errors) {
        throw new Error(createdItem.errors.join(", "));
    }

    const createRelationship = await client.models.PantryItem.create({
        ...relationship,
        itemDataId: createdItem.data?.id,
    });
    if (createRelationship.errors) {
        throw new Error(createRelationship.errors.join(", "));
    }
    return createdItem;
}

async function PersistUpdatedPantryItem(client: typeof Client, item: ItemDataModel, state: PantryItemModel) {
    // TODO: Custom handler for transaction support.
    const updated = await client.models.PantryItem.update(item);
    if (updated.errors) {
        throw new Error(updated.errors.map(_ => _.message).join(", "));
    }

    const relationshipUpdated = await client.models.PantryItem.update(state);
    if (relationshipUpdated.errors) {
        throw new Error(relationshipUpdated.errors.map(_ => _.message).join(", "));
    }
}

const PersistPantryItem: Persister = async (client, state, action: PayloadAction<PantryItem, string>) => {
    const input: PantryItem = action.payload;
    if (input) {
        if (input.item.id) {
            await PersistUpdatedPantryItem(client, input.item as any, input.state);
        } else {
            const itemId = crypto.randomUUID();
            await PersistNewPantryItem(client, {
                name: input.item.name as "string",
                nutrition: input.item.nutrition as object,
                id: itemId,
                membersGroup: [`members:${state.household.id}`],
                adminGroup: [`admin:${state.household.id}`]
            }, {
                ...input.state,
                membersGroup: [`members:${state.household.id}`],
                adminGroup: [`admin:${state.household.id}`]
            });
        }
    }
}

const DeletePantryItem: Persister = async (client, _state, action) => {
    const deleted = await client.models.PantryItem.delete(action.payload);
    if (deleted.errors) {
        throw new Error(deleted.errors.join(", "));
    }
}

const slice = createSlice({
    name: "pantry",
    initialState,
    reducers: {
        AddPantryItem: {
            reducer: (state: PantryState, action: PayloadAction<PantryItem, string>) => {
                state.items.push({...action.payload});
                return state;
            },
            prepare: (payload: PantryItem) => ({
                payload,
                meta: {
                    persister: PersistPantryItem
                },
                error: undefined
            })
        },
        UpdatePantryItem: {
            reducer: (state: PantryState, action: PayloadAction<PantryItem, string>) => {
                const index = state.items.findIndex(item => item.state.pantryId === action.payload.state.pantryId && item.item.id === action.payload.item.id);
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
            reducer: (state: PantryState, action: PayloadAction<PantryItem, string>) => {
                state.items = state.items.filter(item => item.item.id !== action.payload.item.id && item.state.pantryId !== action.payload.state.pantryId);
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