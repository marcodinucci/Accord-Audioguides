/** 
 * MAIN APPLICATION COMPONENT
 * Handles routing, authentication, and global state
 */
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store.js';
import { Layout, AdminLayout, ProtectedRoute, AdminRoute, ErrorBoundary } from './components.jsx';

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages.jsx').then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.CheckoutPage })));
const LibraryPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.LibraryPage })));
const GuideViewerPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.GuideViewerPage })));
const AuthPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.AuthPage })));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.AdminProductsPage })));
const ProductEditorPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.ProductEditorPage })));
const AdminUsersPage = lazy(() => import('./pages.jsx').then(m => ({ default: m.AdminUsersPage })));

// Loading spinner component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="spinner w-16 h-16" />
  </div>
);

/**
 * Main App Component
 * Sets up routing and handles authentication initialization
 */
function App() {
  const { initializeAuth, user, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Redirect admin users to admin panel after login
  useEffect(() => {
    if (user && isAdmin()) {
      const currentPath = window.location.hash.replace('#', '');
      if (currentPath === '/auth' || currentPath === '/') {
        navigate('/admin');
      }
    }
  }, [user, navigate, isAdmin]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Authentication */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Main Layout Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route 
              path="checkout/:productId" 
              element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} 
            />
            <Route 
              path="library" 
              element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} 
            />
            <Route 
              path="guide/:productId" 
              element={<ProtectedRoute><GuideViewerPage /></ProtectedRoute>} 
            />
          </Route>
          
          {/* Admin Layout Routes - Require Admin Access */}
          <Route 
            path="/admin" 
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/:productId" element={<ProductEditorPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;