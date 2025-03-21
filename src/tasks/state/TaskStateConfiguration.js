import {createSlice} from "@reduxjs/toolkit";
import TaskList from "../model/TaskList";

const initialState = {
    taskLists: {
        ["todo"]: (() => {
            const todoList = new TaskList("todo", "To-Do", []);
            todoList.unremovable = true;
            return todoList;
        })()
    },
    selectedTask: null
}

export const slice = createSlice({
    name: "householdTasks",
    initialState,
    selectors: {
        selectLists: state => state.taskLists,
        selectActiveTask: state => state.selectedTask
    },
    reducers: {
        CreateList: (state, action) => {
            state.taskLists[action.payload.id] = action.payload;
            return state;
        },
        CreateTask: (state, action) => {
            state.taskLists[action.payload.targetList].taskItems.push({...action.payload.newTask});
            return state;
        },
        UpdateList: (state, action) => {
            state.taskLists[action.payload.id] = action.payload;
            return state;
        },
        UpdateTask: (state, action) => {
            const task = action.payload;
            const list = state.taskLists[state.selectedList];
            const taskIndex = list.taskItems.findIndex(t => t.id === task.id);
            list.tasks[taskIndex] = task;
            return state;
        },
        DeleteList: (state, action) => {
            delete state.taskLists[action.payload];

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
    },
    extraReducers: builder => {
        builder.addMatcher(action => {
            return action.type === "LOADED_STATE";
        }, (state, action) => {
            const result = action?.payload?.householdTasks || initialState;
            return result;
        })
    }
});

export default slice.reducer;

export const { CreateList, CreateTask, UpdateList, UpdateTask, DeleteList, DeleteTask } = slice.actions;

export const { selectLists, selectActiveTask} = slice.selectors;

export const Persisters = {
    [slice.actions.CreateList.type]: (client, payload) => {
        client.models.TaskList.create(payload);
    }
}