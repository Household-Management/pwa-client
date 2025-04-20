import {fn, spyOn} from '@storybook/test';
import {TaskListDetailPresentation} from "./TaskListDetail";
import Task from "../model/Task";
import {useState} from "react";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {reactRouterParameters, withRouter} from "storybook-addon-remix-react-router";

const store = configureStore({
    reducer: (state, action) => {
        switch (action.type) {
            case "change-role":
                return {
                    ...state,
                    user: {
                        ...state.user,
                        user: {
                            ...state.user.user,
                            roles: [action.payload]
                        }
                    }
                }
            default:
                return state || {
                    user: {
                        user: {
                            id: "1",
                            name: "Test User",
                            roles: ["member-foobar"]
                        }
                    }
                }
        }
    }
})
//TODO: Implement opening and closing the accordions
export default {
    render: args => {
        store.dispatch({
            type: "change-role",
            payload: args.userRole
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
        const onTaskCreated = () => {
            const newTask = new Task(crypto.randomUUID(), "New Task", "New Description");
            list.taskItems.push(newTask);
            setList({...list});
            args.onTaskCreated(newTask);
            setSelectedTask(newTask.id);
            setEditableTaskId(newTask.id);
        }
        const onTaskSelected = (id) => {
            setSelectedTask(id);
            args.onTaskSelected(id);
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

        return <Provider store={store}>
            <TaskListDetailPresentation list={list}
                                        onTaskChanged={onTaskChanged}
                                        onTaskCreated={onTaskCreated}
                                        onTaskSelected={onTaskSelected}
                                        onListDelete={onListDelete}
                                        onListChanged={onListChange}
                                        selectedTaskId={selectedTask}
                                        onTaskDelete={() => {}}
            />
        </Provider>
    }
}

export const TaskListDetailStory = {
    args: {
        list: {
            id: "1",
            name: "List 1",
            taskItems: [
                new Task("1", "Task 1", "Description 1"),
                new Task("2", "Task 2", "Description 2"),
                new Task("3", "Task 3", "Description 3")
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