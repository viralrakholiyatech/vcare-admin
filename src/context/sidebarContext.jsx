import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [openSidebar, setOpenSidebar] = useState(true);

    return(
        <SidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
            {children}
        </SidebarContext.Provider>

    )
}