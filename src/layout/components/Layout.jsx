import {Outlet} from "react-router-dom";
import {useHeader} from "../hooks/HeaderContext";
import BottomNavigator from "../../navigation/components/BottomNavigator";
import React from "react";
import Alerts from "../../alerts/components/Alerts";
import {useSelector} from "react-redux";

const Layout = ({children}) => {
    const {headerContent} = useHeader(); // Get dynamic header content

    const globalAlerts = useSelector(state => {
        return state?.alerts?.queued || [];
    });

    return (
        <div className="app-container">
            <header className="top-bar">
                {headerContent}
            </header>
            <div style={{position: "relative", display: "flex", width: "100%", justifyContent: "center"}}>
                <Alerts queuedAlerts={globalAlerts}/>
            </div>

            <main className="main-content">
                {children}
            </main>

            <BottomNavigator/>
        </div>
    );
};

export default Layout;
