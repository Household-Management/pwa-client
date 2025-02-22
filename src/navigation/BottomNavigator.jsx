import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import {Link} from "react-router-dom";
import KitchenIcon from "@mui/icons-material/Kitchen";
import React, {useState} from "react";

export default function BottomNavigator(props) {
    const [tab, setTab] = useState(0)
    return <Paper id="blahblah" sx={{ display:"flex", position: "relative", flexGrow: 0, flexShrink: 1, justifyContent: "center", bottom: "10px" }} elevation={3}>
        <BottomNavigation showLabels={true} value={tab} onChange={(evt, newValue) => setTab(newValue)}>
            <BottomNavigationAction label="Todos & Chores" icon={<ListIcon/>} component={Link} to="/tasks"  />
            <BottomNavigationAction label="Pantry and Recipes" icon={<KitchenIcon/>} component={Link} to="/pantry"  />
        </BottomNavigation>
    </Paper>
}
