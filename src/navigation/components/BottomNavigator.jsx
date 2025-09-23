import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import {Link} from "react-router-dom";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SettingsIcon from "@mui/icons-material/Settings";
import React, {useState} from "react";

// FIXME: If loading when a top-level route is not selected, no button will be selected.

export default function BottomNavigator(props) {
    const [tab, setTab] = useState(routes.findIndex(({path}) => window.location.pathname.startsWith(path)));
    return <Paper id="blahblah" sx={{ display:"flex", position: "relative", flexGrow: 0, flexShrink: 1, justifyContent: "center", bottom: "10px" }} elevation={3}>
        <BottomNavigation showLabels value={tab} onChange={(evt, newValue) => setTab(newValue)} sx={{justifyContent: "space-evenly", flexGrow: 1}}>
            {
                routes.map(({label, icon, path}) => (<BottomNavigationAction key={path} label={label} icon={icon} component={Link} to={path} />))
            }
        </BottomNavigation>
    </Paper>
}

// TODO: Use configuration to determine which routes are shown
const routes = [
    // {
    //     label: "Todos & Chores",
    //     icon: <ListIcon/>,
    //     path: "/tasks"
    // },
    {
        label: "Pantry and Recipes",
        icon: <RestaurantIcon/>,
        path: "/kitchen"
    },
    {
        label: "Settings",
        icon: <SettingsIcon/>,
        path: "/settings"
    }
];
