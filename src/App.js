import './App.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux'
import {register as registerServiceWorker} from "./serviceWorkerRegistration";

import React from "react";
import TaskStateConfiguration from "./tasks/state/TaskStateConfiguration";
import TasksView from "./tasks/components/TasksView";
import {TutorialStateConfiguration} from "./tutorials/state/TutorialStateConfiguration";
import {Workbox} from "workbox-window";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TasksView/>
    }
]);


// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    tasks: TaskStateConfiguration().reducer,
    tutorials: TutorialStateConfiguration().reducer
});
const store = configureStore({
    reducer: (state, action) => {
        if(action.type == "LOAD_STATE" && action.data) {
            return JSON.parse(action.data);
        } else {
            return combinedReducer(state, action);
        }
    }
});

console.log("Loading state from window");
const wb = new Workbox("/service-worker.js");
wb.active.then((x) => {
    wb.messageSW({
        type: "LOAD_STATE"
    }).then((data) => {
        store.dispatch({
            type: "LOAD_STATE",
            data
        })
    }, err => {
        console.error(err);
    });
});

wb.register();
// TODO: On load, show notification of tasks that are due today.
store.subscribe(() => {
    // TODO: Save is being triggered multiple times, move into saga to prevent multiple saves.
    console.log("Persisting state after store update");
    wb.active.then(_ => {
        wb.messageSW({
            type: 'SAVE_STATE',
            state: JSON.stringify(store.getState())
        })
    });
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
