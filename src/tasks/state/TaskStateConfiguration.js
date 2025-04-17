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

async function PersistList(client, state, action) {
    const taskList = state.household.householdTasks.taskLists.find(t => t.id === action.payload.targetList);
    if (taskList) {
        const updated = await client.models.TaskList.update(taskList);
        if (updated.errors) {
            throw new Error(task.errors);
        }
    }
}

const slice = createSlice({
    name: "householdTasks",
    reducerPath: "household",
    initialState,
    selectors: {
        selectLists: state => state.householdTasks.taskLists,
        selectActiveTask: state => state.householdTasks.selectedTask
    },
    reducers: {
        CreateList: {
            reducer: (state, action) => {
                state.taskLists.push(action.payload);
                return state;
            },
            prepare: (payload) => {
                return {
                    payload,
                    meta: {
                        persister: (client, state, action) => {
                            const household = state.household;
                            client.models.TaskList.create({
                                ...action.payload,
                                adminGroup: household.adminGroup,
                                membersGroup: household.membersGroup,
                                householdTasksId: household.householdTasks.id
                            })
                        }
                    }
                };
            }
        },
        CreateTask: {
            reducer: (state, action) => {
                for (const list of state.taskLists) {

                    if (list.id === action.payload.targetList) {
                        list.taskItems.push({...action.payload.newTask});
                        return state;
                    }
                }
                return state;
            },
            prepare: (payload) => {
                return {
                    payload,
                    meta: {
                        persister: PersistList
                    }
                };
            }
        },
        UpdateList: {
            reducer: (state, action) => {
                for (const list in state.taskLists) {
                    if (state.taskLists[list].id === action.payload.id) {
                        state.taskLists[list] = action.payload;
                        return state;
                    }
                }
                return state;
            },
            prepare: payload => {
                return {
                    payload,
                    meta: {
                        persister: (client, state, action) => {
                            PersistList(client, state, {payload: {targetList: action.payload.id}})
                        }
                    }
                }
            }
        },
        UpdateTask: {
            reducer: (state, action) => {
                for (const list in state.taskLists) {
                    const taskList = state.taskLists[list];
                    if (taskList.id === action.payload.selectedListId) {
                        for (const item in taskList.taskItems) {
                            const taskItem = taskList.taskItems[item];
                            if (taskItem.id === action.payload.task.id) {
                                taskList.taskItems[item] = action.payload.task;
                            }
                        }
                    }
                }
                return state;
            },
            prepare: payload => {
                return {
                    payload,
                    meta: {
                        persister: PersistList
                    }
                }
            }
        },
        DeleteList: {
            reducer: (state, action) => {
                // FIXME: After delete, ui shows no list instead of the next list
                state.taskLists = state.taskLists.filter(t => t.id !== action.payload);
                return state;
            },
            prepare: (payload) => {
                return {
                    payload,
                    meta: {
                        persister: (client, state, action) => {
                            client.models.TaskList.delete({
                                id: action.payload.taskId
                            });
                        }
                    }
                };
            }
        },
        DeleteTask: {
            reducer: (state, action) => {
                const list = state.taskLists.find(list => list.id === action.payload.targetList);
                list.taskItems = list.taskItems.filter(t => t.id !== action.payload.taskId);
                if (action.payload.taskId === state.selectedTask) {
                    state.selectedTask = null;
                }
                return state;
            },
            prepare: (payload) => {
                return {
                    payload,
                    meta: {
                        persister: PersistList
                    }
                };
            }
        }
    },
    extraReducers: builder => {
        builder.addMatcher(action => {
            return action.type === "LOADED_STATE";
        }, (state, action) => {
            const result = action?.payload?.householdTasks || initialState;
            result.taskLists = result.taskLists.map(t => {
                if (!t.taskItems) {
                    t.taskItems = []
                }
                return t;
            })
            return result;
        })
    }
});

export default slice;

export const {CreateList, CreateTask, UpdateList, UpdateTask, DeleteList, DeleteTask} = slice.actions;

export const {selectLists, selectActiveTask} = slice.selectors;

export const Persisters = {
    [slice.actions.CreateList.type]: (client, payload) => {
        client.models.TaskList.create(payload);
    }
}