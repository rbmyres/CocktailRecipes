import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

const setToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export const AuthProvider = ({ children }) => {
    const [authorized, setAuthorized] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setToken(token);
            checkAuth();
        }
        else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/auth`);
            setAuthorized(response.data.user); 
        } catch (error) {
            localStorage.removeItem("auth-token");
            setToken(null);
            setAuthorized(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            if (response.data && response.data.token) {
                localStorage.setItem("auth-token", response.data.token);
                setToken(response.data.token);
                setAuthorized(response.data.user);
                return response.data.user;
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
            localStorage.removeItem("auth-token");
            setToken(null);
            setAuthorized(null);
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.removeItem("auth-token");
            setToken(null);
            setAuthorized(null);
        }
    };

    return (
        <AuthContext.Provider value={{ authorized, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
