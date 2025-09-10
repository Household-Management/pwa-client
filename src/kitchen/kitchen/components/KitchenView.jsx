import {NavLink, Outlet} from "react-router-dom";
import {useHeader} from "../../../layout/hooks/HeaderContext";
import React, {useEffect} from "react";
import {Button, ToggleButton, ToggleButtonGroup, Toolbar} from "@mui/material"
import ConfigurationService from "../../../config/ConfigurationService";

const KitchenView = () => {
    const {setHeaderContent} = useHeader();
    const [selectedView, setSelectedView] = React.useState(window.location.pathname);
    const [enabledLinks, setEnabledLinks] = React.useState([]);
    useEffect(() => {
        async function fetchConfig() {
            const config = [];
            config[0] = await ConfigurationService.getSimpleFlag("pantry_enabled");
            config[1] = await ConfigurationService.getSimpleFlag("recipes_enabled");
            config[2] = await ConfigurationService.getSimpleFlag("grocery_enabled");
            setEnabledLinks(config);
        }
        fetchConfig();
    });
    // Set the dynamic header content
    useEffect(() => {
        setHeaderContent(
            <Toolbar sx={{width: "100%", justifyContent: "center", boxSizing: "border-box"}}>
                <ToggleButtonGroup
                    color="primary"
                    value={window.location.pathname}
                    exclusive
                    onChange={(event, value) => setSelectedView(value)}
                >
                    {enabledLinks[0] && <NavLink to="/kitchen/pantry" className="nav-link">
                        <ToggleButton value="/kitchen/pantry">
                            Pantry & Fridge
                        </ToggleButton>
                    </NavLink>}
                    {enabledLinks[1] && <NavLink to="/kitchen/recipes" className="nav-link">
                        <ToggleButton value="/kitchen/recipes">
                            Recipes
                        </ToggleButton>
                    </NavLink>}
                    {enabledLinks[2] && <NavLink to="/kitchen/grocery" className="nav-link">
                        <ToggleButton value="/kitchen/grocery">
                            Groceries & Shopping Lists
                        </ToggleButton>
                    </NavLink>}
                </ToggleButtonGroup>
            </Toolbar>
        );
    }, [setHeaderContent, selectedView, enabledLinks]);


    return (<Outlet/>);
};

export default KitchenView;
