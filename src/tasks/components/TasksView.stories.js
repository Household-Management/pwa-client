import TasksView from "./TasksView";
import Task from "../model/Task";
import {configureStore, createSlice} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import TaskStateConfiguration from "../state/TaskStateConfiguration";

export default {
    component: TasksView
}

const MockStore = ({state, children}) => {
    return <Provider store={configureStore({
        reducer: {
            tasks: TaskStateConfiguration({
                taskLists: {
                    "1": {
                        name: "List 1",
                        tasks: [
                            {...new Task("1", "Task 1-1", "Description 1")},
                            {...new Task("2", "Task 1-2", "Description 2")},
                            {...new Task("3", "Task 1-3", "Description 3")}
                        ]
                    },
                    "2": {
                        name: "List 2",
                        tasks: [
                            {...new Task("1", "Task 2-1", "Description 1")},
                            {...new Task("2", "Task 2-2", "Description 2")},
                            {...new Task("3", "Task 2-3", "Description 3")}
                        ]
                    }
                },
                selectedTask: null,
                selectedList: "1"
            }).reducer
        }
    })}>
        {children}
    </Provider>
}

export const TasksViewStory = {
    decorators: [Story => <MockStore>{Story()}</MockStore>],
}