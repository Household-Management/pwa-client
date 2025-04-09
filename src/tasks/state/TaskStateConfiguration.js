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
                for(const list of state.taskLists) {

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
                        persister: async (client, state, action) => {
                            const household = state.household;
                            const task = await client.models.Task.create({
                                id: action.payload.newTask.id,
                                title: action.payload.newTask.title,
                                adminGroup: household.adminGroup,
                                membersGroup: household.membersGroup,
                                taskListId: action.payload.targetList
                            });
                            if(task.errors) {
                               throw new Error(task.errors);
                            }

                            await client.models.TaskRepeat.create({
                                ...action.payload.newTask.repeats,
                                owningTaskId: task.data.id,
                                adminGroup: household.adminGroup,
                                membersGroup: household.membersGroup,
                            });
                        }
                    }
                };
            }
        },
        UpdateList: {
            reducer: (state, action) => {
                for(const list in state.taskLists) {
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
                            client.models.TaskList.update({
                                ...action.payload
                            });
                        }
                    }
                }
            }
        },
        UpdateTask: {
            reducer: (state, action) => {
                const task = action.payload;
                const list = state.taskLists[state.selectedList];
                const taskIndex = list.taskItems.findIndex(t => t.id === task.id);
                list.tasks[taskIndex] = task;
                return state;
            },
            prepare: payload => {
                return {
                    payload,
                    meta: {
                        persister: (client, state, action) => {
                            client.models.Task.update({
                                ...action.payload
                            });
                        }
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
                                id: action.payload
                            });
                        }
                    }
                };
            }
        },
        DeleteTask: {
            reducer: (state, action) => {
                const list = state.taskLists[action.payload.fromList];
                list.tasks = list.tasks.filter(t => t.id !== action.payload.taskId);
                if (action.payload.taskId === state.selectedTask) {
                    state.selectedTask = null;
                }
                return state;
            },
            prepare: (payload) => {
                return {
                    payload,
                    meta: {
                        persister: (client, state, action) => {
                            client.models.Task.delete({
                                id: action.payload
                            });
                        }
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