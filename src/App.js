import './App.css';
import {
    RouterProvider,
} from "react-router-dom";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux'

import React from "react";
import TaskStateConfiguration from "./tasks/state/TaskStateConfiguration";
import {TutorialStateConfiguration} from "./tutorials/state/TutorialStateConfiguration";
import {Workbox} from "workbox-window";
import {HeaderProvider} from "./layout/hooks/HeaderContext";
import KitchenStateConfiguration from "./kitchen/state/KitchenStateConfiguration";
import {router} from "./navigation/configuration/routing";
// TODO: Extract the routes into a separate file.


// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    tasks: TaskStateConfiguration().reducer,
    tutorials: TutorialStateConfiguration().reducer,
    kitchen: KitchenStateConfiguration()
});
const store = configureStore({
    reducer: (state, action) => {
        if (action.type == "LOAD_STATE" && action.data) {
            return JSON.parse(action.data);
        } else {
            return combinedReducer(state, action);
        }
    }
});

console.log("Loading state from window");
const wb = new Workbox(`${process.env.PUBLIC_URL}/service-worker.js`);
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

Notification.requestPermission().then(permission => {
    if (permission === "granted") {
        console.log("Notifications granted");
    }
});

wb.register();
// TODO: On load, show notification of tasks that are due today.
store.subscribe(() => {
    // TODO: Save is being triggered multiple times, move into saga to prevent multiple saves.
    console.log("Persisting state after store update");
    wb.active.then(_ => {
        const state = store.getState()
        wb.messageSW({
            type: 'SAVE_STATE',
            state: JSON.stringify(state)
        })
    });
});

// TODO: Implement notifications for tasks.
// TODO: Implement settings page.
function App() {
    return (
        <div className="App" style={{display: "flex", flexDirection: "column", height: "100vh"}}>
            <HeaderProvider>
            <Provider store={store}>
                <RouterProvider router={router}/>
            </Provider>
            </HeaderProvider>

        </div>
    );
}


export default App;
