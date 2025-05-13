import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { NewsProvider } from './contexts/NewsContext';
import { GalleryProvider } from './contexts/GalleryContext';
import { SportsProvider } from './contexts/SportsContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import GalleryPage from './pages/GalleryPage';
import NewsListPage from './pages/news/NewsListPage';
import NewsDetailPage from './pages/news/NewsDetailPage';
import StatsPage from './pages/StatsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import NewsAdminPage from './pages/admin/NewsAdminPage';
import GalleryAdminPage from './pages/admin/GalleryAdminPage';
import FixtureAdminPage from './pages/admin/FixtureAdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedAdmin from './components/admin/ProtectedAdmin';

/**
 * Main App component serving as the entry point for the application
 * Defines all routes and their corresponding components
 */
function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <NewsProvider>
          <GalleryProvider>
            <SportsProvider>
              <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<NewsListPage />} />
                <Route path="noticias/:id" element={<NewsDetailPage />} />
                <Route path="galeria" element={<GalleryPage />} />
                <Route path="estadisticas" element={<StatsPage />} />
                <Route path="admin/login" element={<AdminLoginPage />} />
                <Route path="admin" element={
                  <ProtectedAdmin><AdminLayout /></ProtectedAdmin>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="noticias" element={<NewsAdminPage />} />
                  <Route path="galeria" element={<GalleryAdminPage />} />
                  <Route path="fixture" element={<FixtureAdminPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              </Routes>
            </SportsProvider>
          </GalleryProvider>
        </NewsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;