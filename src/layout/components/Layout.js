import { Outlet } from "react-router-dom";
import { useHeader } from "../hooks/HeaderContext";
import BottomNavigator from "../../navigation/components/BottomNavigator";
import React from "react";
import Alerts from "../../alerts/components/Alerts";

const Layout = () => {
    const { headerContent } = useHeader(); // Get dynamic header content

    return (
        <div className="app-container">
            <header className="top-bar">
                {headerContent}
            </header>
            <Alerts/>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            <BottomNavigator/>
        </div>
    );
};

export default Layout;
