import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "./components/ui/sonner";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import AssetsPage from './pages/AssetsPage';
import PhotoboothsPage from './pages/PhotoboothsPage';
import SessionsPage from './pages/SessionsPage';
import PhotosPage from './pages/PhotosPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

export function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/photos" 
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/photobooths" 
            element={
              <ProtectedRoute>
                <PhotoboothsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sessions" 
            element={
              <ProtectedRoute>
                <SessionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/photos-management" 
            element={
              <ProtectedRoute>
                <PhotosPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}