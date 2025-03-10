import {combineReducers, createSlice} from "@reduxjs/toolkit";

let slice = createSlice({
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
            if (state.queued.length > 0) {
                state.queued.shift();
            }
            return state;
        },
    }
});

export default slice.reducer;

export const Clear = payload => ({...slice.actions.Clear(payload), noSave: true});
export const Alert = payload => ({...slice.actions.Alert(payload), noSave: true});