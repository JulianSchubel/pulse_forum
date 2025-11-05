import { createContext, useState, useEffect, ReactNode } from "react";

const NavigationContext = createContext({});

export type NavigationContext = {
    currentPath: string,
    navigate: () => void,
}

function NavigationProvider({children}: {children: ReactNode}) {
    /* will cause components to rerender when user clicks forward and back buttons */
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    
    /* setup handler for back & forward button clicks (popstate events) */
    useEffect( () => {
        const handler = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener("popstate", handler);
        return () => {
            window.removeEventListener("popstate", handler);
        };
    }, []);

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        setCurrentPath(path);
    }

    return (
        <NavigationContext.Provider value={{currentPath,  navigate}}>
            {children}
        </NavigationContext.Provider>
    );
}

export { NavigationProvider };
export default NavigationContext;
