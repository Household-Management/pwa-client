import './App.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux'

import React from "react";
import TaskStateConfiguration from "./tasks/state/TaskStateConfiguration";
import TasksView from "./tasks/components/TasksView";
import {TutorialStateConfiguration} from "./tutorials/state/TutorialStateConfiguration";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TasksView/>
    }
]);

const initialState = localStorage.getItem("state") ? JSON.parse(localStorage.getItem("state")) :
    {
        tasks: {
            taskLists: {},
            selectedList: null
        }
    };

// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const store = configureStore({
    reducer: {
        tasks: TaskStateConfiguration(initialState.tasks).reducer,
        tutorials: TutorialStateConfiguration(initialState.tutorials).reducer
    }
});

store.subscribe(() => {
    localStorage.setItem("state", JSON.stringify(store.getState()));
});

// TODO: Implement notifications for tasks.
// TODO: Implement settings page.
// TODO: Implement bottom navigation.
function App() {
    return (
        <div className="App" style={{display: "flex", flexDirection: "column"}}>
            <Provider store={store}>
                <RouterProvider router={router}/>
            </Provider>
            {/*<Paper sx={{ display:"flex", flexGrow: 0, flexShrink: 0, justifyContent: "center", bottom: 0, left: 0, right: 0 }} elevation={3}>*/}
            {/*    <BottomNavigation showLabels={true}>*/}
            {/*        <BottomNavigationAction label="Todos & Chores" icon={<ListIcon/>}/>*/}
            {/*    </BottomNavigation>*/}
            {/*</Paper>*/}
        </div>
    );
}


export default App;
