import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { NewsProvider } from './contexts/NewsContext';
import { SportsProvider } from './contexts/SportsContext';
import { AuthProvider } from './contexts/AuthContext';
import { StandingsProvider } from './contexts/StandingsContext';
import Layout from './components/layout/Layout';
import NewsListPage from './pages/news/NewsListPage';
import NewsDetailPage from './pages/news/NewsDetailPage';
import StatsPage from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main App component serving as the entry point for the application
 * Defines all routes and their corresponding components
 */
function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <NewsProvider>
          <SportsProvider>
            <StandingsProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<NewsListPage />} />
                  <Route path="noticias/:id" element={<NewsDetailPage />} />
                  <Route path="estadisticas" element={<StatsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </StandingsProvider>
          </SportsProvider>
        </NewsProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;