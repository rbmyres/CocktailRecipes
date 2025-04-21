import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [authorized, setAuthorized] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/auth`, { withCredentials: true });
            setAuthorized(response.data.user); 
        } catch (error) {
            setAuthorized(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
            await checkAuth(); 
            console.log("Log in successful");
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
            setAuthorized(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ authorized, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
