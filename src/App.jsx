import './App.css';
import {
    RouterProvider,
} from "react-router-dom";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux'
import * as _ from "underscore";

import React from "react";
import TaskStateConfiguration from "./tasks/state/TaskStateConfiguration";
import {TutorialStateConfiguration} from "./tutorials/state/TutorialStateConfiguration";
import {Workbox} from "workbox-window";
import {HeaderProvider} from "./layout/hooks/HeaderContext.jsx";
import KitchenStateConfiguration from "./kitchen/state/KitchenStateConfiguration";
import {router} from "./navigation/configuration/routing";
import AlertsStateConfiguration from "./alerts/configuration/AlertsStateConfiguration";
import { getActions as getAlertActions} from "./alerts/configuration/AlertsStateConfiguration";

// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    tasks: TaskStateConfiguration().reducer,
    tutorials: TutorialStateConfiguration().reducer,
    kitchen: KitchenStateConfiguration(),
    alerts: AlertsStateConfiguration()
});
const store = configureStore({
    reducer: (state, action) => {
        if (action.type == "LOAD_STATE" && action.data) {
            return {alerts: state.alerts, ...JSON.parse(action.data)};
        } else {
            return combinedReducer(state, action);
        }
    }
});

console.log("Loading state from window");
const wb = new Workbox(`/service-worker.js`);

navigator.serviceWorker.addEventListener('message', (event) => {
    switch (event.data.type) {
        case "ALERT":
            store.dispatch(getAlertActions().Alert(JSON.parse(event.data.payload)));
            break;
        default:
            break;
    }
});

wb.active.then(() => {
    wb.messageSW({
        type: "LOAD_STATE"
    }).then((data) => {
        console.log("Loaded from service worker.");
        store.dispatch({
            type: "LOAD_STATE",
            data
        });
        store.dispatch(getAlertActions().Alert({message: "State loaded", type: "info"}));
    }, err => {
        console.error(err);
    });
});

// Notification.requestPermission().then(permission => {
//     if (permission === "granted") {
//         console.log("Notifications granted");
//     }
// });

wb.register();
// TODO: On load, show notification of tasks that are due today.
store.subscribe(() => {
    // TODO: Save is being triggered multiple times, move into saga to prevent multiple saves.
    console.log("Persisting state after store update");
    wb.active.then(x => {
        const state = store.getState()
        console.log("save", state.alerts.active)
        wb.messageSW({
            type: 'SAVE_STATE',
            state: JSON.stringify(_.omit(state, ["alerts"]))
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
