import {createSlice} from "@reduxjs/toolkit";
let slice = undefined;
export default function (initialState) {
    slice = createSlice({
        name: "tasks",
        initialState: initialState ? initialState : {
            taskLists: {},
            selectedTask: null,
            selectedList: null
        },
        reducers: {
            SelectList: (state, action) => {
                state.selectedList = action.payload;
                return state;
            },
            SelectTask: (state, action) => {
                state.selectedTask = action.payload;
                return state;
            },
            CreateList: (state, action) => {
                state.taskLists[action.payload.id] = action.payload;
                return state;
            },
            CreateTask: (state, action) => {
                state.taskLists[action.payload.targetList].tasks.push({...action.payload.newTask});
                return state;
            },
        }
    });
    return slice;
}

export function getActions() {
    return slice.actions;
}
