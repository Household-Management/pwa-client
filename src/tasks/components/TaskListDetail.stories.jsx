import {fn, spyOn} from 'storybook/test';
import TaskListDetail from "./TaskListDetail";
import Task from "../model/Task";
import {useState} from "react";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import moment from "moment";

const store = configureStore({
    reducer: (state, action) => {
        switch (action.type) {
            case "change-role":
                return {
                    ...state,
                    user: {
                        ...state.user,
                        roles: [action.payload]
                    }
                }
            default:
                return state || {
                    household: {
                        id: 1,
                    },
                    user: {
                        loginId: "1",
                        name: "Test User",
                        roles: []
                    }
                }
        }
    }
})

export default {
    render: args => {
        store.dispatch({
            type: "change-role",
            payload: `${args.userRole}:1`
        });
        args.list.unremovable = args.unremovable;
        const [list, setList] = useState(args.list);
        const [selectedTask, setSelectedTask] = useState(args.selectedTask);

        const onTaskChanged = task => {
            console.log("Task changed: ", task);
            const index = list.taskItems.findIndex(t => t.id === task.id);
            list.taskItems[index] = task;
            setList({...list});
            args.onTaskChanged({...list})
        }
        const onTaskCreated = (cb) => {
            const newTask = new Task(crypto.randomUUID(), "New Task", "New Description");
            list.taskItems.push(newTask);
            setList({...list});
            args.onTaskCreated(newTask);
            setSelectedTask(newTask.id);
            cb(newTask.id);
        }
        const onTaskSelected = (id, toggled) => {
            if (toggled) {
                setSelectedTask(id);
            } else {
                setSelectedTask(null);
            }
            args.onTaskSelected(id, toggled);
        }

        const onListDelete = (id) => {
            args.onListDelete(id);
            alert("This would delete the list.");
        }

        const onListChange = (list) => {
            console.log(JSON.stringify(list));
            setList(list);
            args.onListChanged(list);
        }

        return <div className="App">
            <Provider store={store}>
                <TaskListDetail list={list}
                                onTaskChanged={onTaskChanged}
                                onTaskCreated={onTaskCreated}
                                onTaskSelected={onTaskSelected}
                                onListDelete={onListDelete}
                                onListChanged={onListChange}
                                selectedTaskId={selectedTask}
                                onTaskDelete={() => {
                                }}
                />
            </Provider>
        </div>
    }
}

export const TaskListDetailStory = {
    args: {
        list: {
            id: "1",
            name: "List 1",
            taskItems: [
                {
                    ...new Task("1", "One Time Task", ""),
                    repeats: "NEVER"
                },
                {
                    ...new Task("2", "One Time Future Task", ""),
                    scheduledTime: moment().add(1, "days").toISOString(),
                    repeats: "NEVER"
                },
                {
                    ...new Task("3", "One Time Past Task", ""),
                    lastCompleted: [moment().subtract(1, "days").toISOString()],
                    repeats: "NEVER"
                },
                {
                    ...new Task("2", "Daily Task", "Description 1"),
                    repeats: "DAILY"
                },
                {
                    ...new Task("3", "Weekly Task", "Description 2"),
                    repeats: "WEEKLY-0000000"
                },
                {
                    ...new Task("4", "Task 3", "Description 3"),
                repeats: "MONTHLY-0000000000000000000000000000000"
                }
            ]
        },
        unremovable: false,
        onClose: fn(),
        onConfirm: fn(),
        onCancel: fn(),
        onTaskChanged: fn(),
        onTaskCreated: fn(),
        onTaskSelected: fn(),
        onListDelete: fn(),
        onListChanged: fn(),
        userRole: "member"
    }
}