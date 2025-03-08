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
import {store} from "./redux/store";



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
