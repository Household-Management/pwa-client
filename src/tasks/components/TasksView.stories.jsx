import TasksView from "./TasksView";
import {combineReducers, combineSlices, configureStore, createSlice} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import TaskStateConfiguration from "../state/TaskStateConfiguration";
import {HeaderProvider} from "../../layout/hooks/HeaderContext";
import {reactRouterOutlet, reactRouterParameters, withRouter} from "storybook-addon-remix-react-router";
import Task from "../model/Task";
import Layout from "../../layout/components/Layout";
import {Outlet} from "react-router-dom";
import {makeDecorator} from "@storybook/preview-api";

export default {
    component: TasksView
}

const store = configureStore({
    reducer: combineReducers({
        user: (state, action) => {
            return state || {
                user: {
                    roles: []
                }
            };
        },
        household: combineSlices({
            householdTasks: TaskStateConfiguration.reducer
        })
    })
});

store.dispatch({
    type: "LOADED_STATE",
    payload: {
        householdTasks: {
            taskLists: [{
                id: "1",
                name: "List 1",
                taskItems: [
                    {...new Task("1", "Task 1-1", "Description 1")},
                    {...new Task("2", "Task 1-2", "Description 2")},
                    {...new Task("3", "Task 1-3", "Description 3")}
                ]
            },
                {
                    id: "2",
                    name: "List 2",
                    taskItems: [
                        {...new Task("1", "Task 2-1", "Description 1")},
                        {...new Task("2", "Task 2-2", "Description 2")},
                        {...new Task("3", "Task 2-3", "Description 3")}
                    ]
                }]
        }
    }
})

export const TasksViewStory = {
    render: () => (
        <Provider store={store}>
            <HeaderProvider>
                <Layout>
                    <TasksView/>
                </Layout>
            </HeaderProvider>
        </Provider>
    ),
    decorators: [
        withRouter
    ],
    parameters: {
        reactRouter: reactRouterParameters({
            location: {
                path: args => "/tasks/1",
            },
            routing: [{
                useStoryElement: true,
                path: "/tasks/:list/task/:task"
            },
                {
                    useStoryElement: true,
                    path: "/tasks/:list"
                }
            ]
        })
    }
}