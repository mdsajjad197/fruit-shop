import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user on mount
    const fetchMe = useCallback(async () => {
        try {
            const { data } = await authApi.getMe();
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
        // Debug helper
        window.getAuthToken = () => localStorage.getItem('token');
    }, [fetchMe]);


    const register = async (name, email, password) => {
        const { data } = await authApi.register({ name, email, password });
        if (data.token) localStorage.setItem('token', data.token);
        setUser(data.user);
        toast.success(`Welcome, ${data.user.name}! 🎉`);
        return data;
    };


    const login = async (email, password) => {
        const { data } = await authApi.login({ email, password });
        if (data.token) localStorage.setItem('token', data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! 🍊`);
        return data;
    };


    const logout = async () => {
        await authApi.logout();
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully.');
    };


    const updateUser = (updatedUser) => setUser(updatedUser);

    return (
        <AuthContext.Provider
            value={{ user, loading, register, login, logout, updateUser, refetch: fetchMe }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
