import TasksView from "./TasksView";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {HeaderProvider} from "../../layout/hooks/HeaderContext";
import {reactRouterParameters, withRouter} from "storybook-addon-remix-react-router";
import Task from "../model/Task";
import Layout from "../../layout/components/Layout";
import {combinedReducer} from "../../redux/store"

export default {
    component: TasksView
}

const store = configureStore({
    reducer: combinedReducer
});

store.dispatch({
    type: "LOADED_STATE",
    payload: {
        id: "1",
        adminGroup: ["admin:1"],
        membersGroup: ["member:1"],
        householdTasks: {
            taskLists: [
                {
                    id: "1",
                    name: "List 1",
                    taskItems: [
                        {
                            ...new Task("1", "Task 1-1", "Description 1"),
                            repeats: "DAILY"
                        },
                        {
                            ...new Task("2", "Task 1-2", "Description 2"),
                            repeats: "DAILY"
                        },
                        {
                            ...new Task("3", "Task 1-3", "Description 3"),
                            repeats: "DAILY"
                        }
                    ]
                },
                {
                    id: "2",
                    name: "List 2",
                    taskItems: [
                        {
                            ...new Task("1", "Task 2-1", "Description 1"),
                            repeats: "DAILY"
                        },
                        {
                            ...new Task("2", "Task 2-2", "Description 2"),
                            repeats: "DAILY"
                        },
                        {
                            ...new Task("3", "Task 2-3", "Description 3"),
                            repeats: "DAILY"
                        }
                    ]
                }]
        }
    }
})

export const TasksViewStory = {
    render: (args) => {
        store.dispatch({
            type: "AUTHENTICATED",
            payload: {
                loginId: "1",
                roles: args.userRoles.map(role => `${role}:1`),
            }
        })

        return (<Provider store={store}>
                <HeaderProvider>
                    <Layout>
                        <TasksView/>
                    </Layout>
                </HeaderProvider>
            </Provider>
        )
    },
    args: {
        userRoles: ["members"]
    },
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