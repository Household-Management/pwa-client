import './App.css';
import {
    RouterProvider,
} from "react-router-dom";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux'
import * as _ from "underscore";

import React, {useContext} from "react";
import TaskStateConfiguration from "./tasks/state/TaskStateConfiguration";
import {TutorialStateConfiguration} from "./tutorials/state/TutorialStateConfiguration";
import {Workbox} from "workbox-window";
import {HeaderProvider} from "./layout/hooks/HeaderContext.jsx";
import KitchenStateConfiguration from "./kitchen/state/KitchenStateConfiguration";
import {router} from "./navigation/configuration/routing";
import AlertsStateConfiguration from "./alerts/configuration/AlertsStateConfiguration";
import {getActions as getAlertActions} from "./alerts/configuration/AlertsStateConfiguration";
import AppAuthenticator from "./authentication/components/AppAuthenticator";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs";
import {ServiceWorkerContext} from "./service-worker/ServiceWorkerContext";

// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    tasks: TaskStateConfiguration().reducer,
    tutorials: TutorialStateConfiguration().reducer,
    kitchen: KitchenStateConfiguration(),
    alerts: AlertsStateConfiguration(),
    user: (state = null, action) => {
        if (action.type === "UNAUTHENTICATED") {
            return null;
        } else if (action.type === "AUTHENTICATED") {
            return action.data;
        } else {
            return state ? state : {
                user: null,
                welcomed: false
            };
        }
    }
});
const store = configureStore({
    reducer: (state, action) => {
        if (action.type === "UNAUTHENTICATED") {
            return {...state, user: null};
        } else if (action.type === "AUTHENTICATED") {
            if (!state.user?.welcomed) {
                return {
                    ...state, user: {
                        user: action.data,
                        welcomed: true
                    }, alerts: {
                        active: state.alerts.active,
                        queued: [...state.alerts.queued, {
                            message: `Welcome ${action.data.signInDetails.loginId}`,
                            type: "success"
                        }]
                    }
                }
            } else {
                return {
                    ...state, user: {
                        user: action.data,
                        welcomed: state.user.welcomed
                    }
                }
            }

        }

        if (action.type == "LOAD_STATE" && action.data) {
            return {alerts: state.alerts, ...JSON.parse(action.data)};
        } else {
            return combinedReducer(state, action);
        }
    }
});

console.log("Loading state from window");

navigator.serviceWorker.addEventListener('message', (event) => {
    switch (event.data.type) {
        case "ALERT":
            store.dispatch(getAlertActions().Alert(JSON.parse(event.data.payload)));
            break;
        default:
            break;
    }
});

Amplify.configure(outputs);

// TODO: On load, show notification of tasks that are due today.
store.subscribe(() => {
    // TODO: Save is being triggered multiple times, move into saga to prevent multiple saves.
    console.log("Persisting state after store update");
    const wb = ServiceWorkerContext.Provider._context._currentValue;
    wb.active.then(x => {
        const state = store.getState()
        console.log("save", state.alerts.active)
        wb.messageSW({
            type: 'SAVE_STATE', state: JSON.stringify(_.omit(state, ["alerts"]))
        })
    });
});

// TODO: Implement notifications for tasks.
// TODO: Implement settings page.
function App() {
    return (<div className="App" style={{display: "flex", flexDirection: "column", height: "100vh"}}>
        <Provider store={store}>
            <AppAuthenticator>
                <HeaderProvider>
                    <RouterProvider router={router}/>
                </HeaderProvider>
            </AppAuthenticator>
        </Provider>
    </div>);

}

export default App;
