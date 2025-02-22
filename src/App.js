import './App.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {Provider} from 'react-redux'

import React from "react";
import TaskStateConfiguration from "./tasks/state/TaskStateConfiguration";
import TasksView from "./tasks/components/TasksView";
import {TutorialStateConfiguration} from "./tutorials/state/TutorialStateConfiguration";
import {Workbox} from "workbox-window";
import Layout from "./layout/components/Layout";
import {HeaderProvider} from "./layout/hooks/HeaderContext";
import KitchenView from "./kitchen/components/KitchenView";
import PantryView from "./kitchen/components/PantryView";
import RecipesView from "./kitchen/components/RecipesView";
import GroceryView from "./kitchen/components/GroceryView";
import KitchenStateConfiguration from "./kitchen/state/KitchenStateConfiguration";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (<Layout/>),
            children: [{
                path: "/tasks",
                element: <TasksView/>
            }, {
                path: "/kitchen",
                element: <KitchenView/>,
                children: [
                    {
                        path: "pantry",
                        element: <PantryView/>
                    },
                    {
                        path: "recipes",
                        element: <RecipesView/>
                    },
                    {
                        path: "grocery",
                        element: <GroceryView/>
                    }
                ]
            }]
        }
    ]);


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
