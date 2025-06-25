import { createContext, useState, useEffect } from "react"
import authService from "../services/authService";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
    const [nearByHospital, setNearByHospital] = useState(null);
    const [loc, setLoc] = useState({ latitude: null, longitude: null });
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize authentication state on app load
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();
        
        setUser(currentUser);
        setIsAuthenticated(authenticated);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const result = await authService.login(email, password);
            setUser(result.user);
            setIsAuthenticated(true);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Register function
    const register = async (email, password, name) => {
        try {
            const result = await authService.register(email, password, name);
            setUser(result.user);
            setIsAuthenticated(true);
            return result;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        nearByHospital,
        setNearByHospital,
        loc,
        setLoc,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        register
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}