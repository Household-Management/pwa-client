import {createSlice} from "@reduxjs/toolkit";
import Tutorial from "../model/Tutorial";

let slice = undefined;

// TODO: Validate initial state
export function TutorialStateConfiguration(initialState) {
    slice = createSlice({
        name: "tasks",
        initialState: initialState ? initialState : {
            tutorials: {
                "create-list": {
                    ...new Tutorial("create-list", "#To create new lists of tasks, click here", ["#create-list"],
                        {type: "click", target: "#create-list"})
                },
            }
        },
        reducers: {
            StartTutorial(state, action) {
                if (!state.tutorials[action.payload].completed && !state.activeTutorial) {
                    state.activeTutorial = {...state.tutorials[action.payload]};
                }
                return state;
            },
            CompleteTutorial(state, action) {
                state.tutorials[state.activeTutorial.id].completed = true;
                state.activeTutorial = undefined;
                return state;
            },
            ReadyTutorial(state, action) {
                state.activeTutorial.ready = true;
                return state;
            }
        }
    });
    return slice;
}

// TODO: Make property of config function?
export function getActions() {
    return slice.actions;
}
