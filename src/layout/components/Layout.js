import { Outlet } from "react-router-dom";
import { useHeader } from "../hooks/HeaderContext";
import BottomNavigator from "../../navigation/BottomNavigator";
import React from "react";

const Layout = () => {
    const { headerContent } = useHeader(); // Get dynamic header content

    return (
        <div className="app-container">
            {/* Top Bar with dynamic content */}
            <header className="top-bar">
                {headerContent}
            </header>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

            <BottomNavigator/>
        </div>
    );
};

export default Layout;
