"use client";
import React, { createContext, useState, useEffect } from "react";

// Create Context
const CommonContext = createContext();

// Provider Component
export const CommonProvider = ({ children }) => {
    const [selectedItem, setSelectedItem] = useState("Dashboard");
    return (
        <CommonContext.Provider value={{ selectedItem, setSelectedItem }}>
            {children}
        </CommonContext.Provider>
    );
};

export const useCommon = () => React.useContext(CommonContext);
