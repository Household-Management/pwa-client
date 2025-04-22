import { createContext, useState, useContext } from "react";

// Create a Context for managing header content
const HeaderContext = createContext(null);

// Custom hook to use the context easily in other components
export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
    const [headerContent, setHeaderContent] = useState(null);

    return (
        <HeaderContext.Provider value={{ headerContent, setHeaderContent }}>
            {children}
        </HeaderContext.Provider>
    );
};
