import {NavLink, Outlet} from "react-router-dom";
import {useHeader} from "../../layout/hooks/HeaderContext";
import React, {useEffect} from "react";
import {Button, ToggleButton, ToggleButtonGroup, Toolbar} from "@mui/material"

const KitchenView = () => {
    const {setHeaderContent} = useHeader();
    const [selectedView, setSelectedView] = React.useState(window.location.pathname);
    // Set the dynamic header content
    useEffect(() => {
        setHeaderContent(
            <Toolbar sx={{width: "100%", "justify-content": "center", boxSizing: "border-box"}}>
                <ToggleButtonGroup
                    color="primary"
                    value={window.location.pathname}
                    exclusive
                    onChange={(event, value) => setSelectedView(value)}
                >
                    <NavLink to="/kitchen/pantry" className="nav-link">
                        <ToggleButton value="/kitchen/pantry">
                            Pantry & Fridge
                        </ToggleButton>
                    </NavLink>
                    <NavLink to="/kitchen/recipes" className="nav-link">
                        <ToggleButton value="/kitchen/recipes">
                            Recipes
                        </ToggleButton>
                    </NavLink>
                    <NavLink to="/kitchen/grocery" className="nav-link">
                        <ToggleButton value="/kitchen/grocery">
                            Groceries
                        </ToggleButton>
                    </NavLink>
                </ToggleButtonGroup>
            </Toolbar>
        );
    }, [setHeaderContent, selectedView]);


    return (
        <div className="content">
            <Outlet/>
        </div>
    );
};

export default KitchenView;
