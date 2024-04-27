import {createSlice} from "@reduxjs/toolkit";
let slice = undefined;
export function TutorialStateConfiguration(initialState) {
    slice = createSlice({
        name: "tasks",
        initialState: initialState ? initialState : {
            tutorials: {}
        },
        reducers: {

        }
    });
    return slice;
}

export function getActions() {
    return slice.actions;
}
