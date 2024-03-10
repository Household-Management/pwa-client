import logo from './logo.svg';
import './App.css';
import {BottomNavigation, BottomNavigationAction, Button, Drawer, Paper} from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Tasks from "./tasks/components/Tasks";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Tasks/>
    }
])

function App() {
  return (
    <div className="App" style={{display: "flex", flexDirection: "column"}}>
        <RouterProvider router={router}/>
        {/*<Paper sx={{ display:"flex", flexGrow: 0, flexShrink: 0, justifyContent: "center", bottom: 0, left: 0, right: 0 }} elevation={3}>*/}
        {/*    <BottomNavigation showLabels={true}>*/}
        {/*        <BottomNavigationAction label="Todos & Chores" icon={<ListIcon/>}/>*/}
        {/*    </BottomNavigation>*/}
        {/*</Paper>*/}
    </div>
  );
}

export default App;
