import {Link, NavLink, Outlet} from "react-router-dom";
import { useHeader } from "../../layout/hooks/HeaderContext";
import React, {useEffect} from "react";
import {BottomNavigationAction, Button, Toolbar} from "@mui/material"

const KitchenView = () => {
    const { setHeaderContent } = useHeader();

    // Set the dynamic header content
    useEffect(() => {
        setHeaderContent(
            <Toolbar sx={{ width: "100%", "justify-content" : "center", boxSizing : "border-box"}}>
                <NavLink to="/kitchen/pantry" className="nav-link">
                    <Button>
                        Pantry & Fridge
                    </Button>
                </NavLink>
                <NavLink to="/kitchen/recipes" className="nav-link">
                    <Button>
                        Recipes
                    </Button>
                </NavLink>
                <NavLink to="/kitchen/grocery" className="nav-link">
                    <Button>
                        Groceries
                    </Button>
                </NavLink>
            </Toolbar>
        );
    }, [setHeaderContent]);


    return (
        <div className="content">
            <Outlet />
        </div>
    );
};

export default KitchenView;
