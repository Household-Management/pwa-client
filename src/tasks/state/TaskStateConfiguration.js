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
            UpdateList: (state, action) => {
                state.taskLists[action.payload.id] = action.payload;
                return state;
            },
            UpdateTask: (state, action) => {
                const task = action.payload;
                const list = state.taskLists[state.selectedList];
                const taskIndex = list.tasks.findIndex(t => t.id === task.id);
                list.tasks[taskIndex] = task;
                return state;
            },
            DeleteList: (state, action) => {
                delete state.taskLists[action.payload];
                if(action.payload === state.selectedList) {
                    state.selectedList = Object.keys(state.taskLists)[0];
                }
                return state;
            },
            DeleteTask: (state, action) => {
                const list = state.taskLists[action.payload.fromList];
                list.tasks = list.tasks.filter(t => t.id !== action.payload.taskId);
                if(action.payload.taskId === state.selectedTask) {
                    state.selectedTask = null;
                }
                return state;
            }
        }
    });
    return slice;
}

export function getActions() {
    return slice.actions;
}
