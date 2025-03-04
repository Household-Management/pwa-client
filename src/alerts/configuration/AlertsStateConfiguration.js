import {combineReducers, createSlice} from "@reduxjs/toolkit";

let slice = undefined;
export default function (initialState) {
    slice = createSlice({
        name: "alerts",
        initialState: {
            active: null,
            queued: []
        },
        reducers: {
            Alert: (state, action) => {
                state.queued.push(action.payload);

                return state;
            },

            Clear: (state) => {
                if(state.queued.length > 0) {
                    state.queued.shift();
                }
                return state;
            },
        }
    })

    for(const key in slice.actions) {
        actions[key] = slice.actions[key];
    }
    return slice.reducer;


}

export function getActions() {
    return actions;
}

export const actions = {}