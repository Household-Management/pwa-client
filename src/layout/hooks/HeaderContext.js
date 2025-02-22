import { createContext, useState, useContext } from "react";

// Create a Context for managing header content
const HeaderContext = createContext();

// Custom hook to use the context easily in other components
export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
    const [headerContent, setHeaderContent] = useState(<h1>App Title</h1>);

    return (
        <HeaderContext.Provider value={{ headerContent, setHeaderContent }}>
            {children}
        </HeaderContext.Provider>
    );
};
