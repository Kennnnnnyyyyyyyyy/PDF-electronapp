import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import './index.css'

// Protected Route Component
const ProtectedLayout = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Outlet />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<ProtectedLayout />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/editor/:draftId" element={<EditorPage />} />
                    </Route>
                </Routes>
            </HashRouter>
        </AuthProvider>
    </React.StrictMode>,
)
