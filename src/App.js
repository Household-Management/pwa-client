import './App.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux'

import TaskListsBar from "./tasks/components/TaskListsBar";
import React from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TaskListsBar/>
    }
])

// TODO: Implement local persistence.
const store = configureStore({
    initialState: {
        tasks: {
            taskLists: {},
            selectedList: null
        }
    },
    reducers: {}
})

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
