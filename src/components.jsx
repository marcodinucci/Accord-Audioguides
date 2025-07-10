/**
 * REUSABLE UI COMPONENTS
 * All common components consolidated in one file
 */
import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store.js';
import { uploadFile, getPublicUrl } from './lib.js';
import { toast } from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';

// Safe Icon Component
export const SafeIcon = ({ icon, name, className = '', size = 20, ...props }) => {
  const IconComponent = icon || FiIcons[`Fi${name}`] || FiIcons.FiAlertTriangle;
  return <IconComponent className={className} size={size} {...props} />;
};

// Button Component
export const Button = ({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled = false, ...props }) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="spinner w-4 h-4 mr-2" />}
      {children}
    </motion.button>
  );
};

// Card Component
export const Card = ({ children, className = '', hover = false, padding = 'p-6', ...props }) => {
  const classes = [
    hover ? 'card-hover' : 'card',
    padding,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} {...props}>{children}</div>;
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return <div className={`spinner ${sizeClasses[size]} ${className}`} />;
};

// File Upload Component
export const FileUpload = ({ bucket, path = '', accept, onUpload, currentFiles = [], label = "Upload File" }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();

  const handleFileUpload = async (files) => {
    if (!files?.length || !user) return;

    setUploading(true);
    try {
      const file = files[0];
      const { data, error } = await uploadFile(bucket, path, file);
      if (error) throw error;

      const publicUrl = getPublicUrl(bucket, data.path);
      if (onUpload) onUpload({
        name: file.name,
        path: data.path,
        url: publicUrl,
        type: file.type
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          disabled={uploading || !user}
        />

        {uploading ? (
          <div className="space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <SafeIcon icon={FiIcons.FiUpload} className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-500 mt-1">
                {user ? 'Click to browse' : 'Please sign in to upload'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!user}
            >
              Choose File
            </Button>
          </div>
        )}
      </div>

      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Current Files</h4>
          {currentFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <SafeIcon icon={FiIcons.FiFile} className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Rich Text Editor (Simple)
export const RichTextEditor = ({ value, onChange, placeholder, rows = 6 }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      placeholder={placeholder}
      rows={rows}
    />
  );
};

// Protected Route
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;

  return children;
};

// Admin Route
export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuthStore();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  if (!user || !isAdmin()) return <Navigate to="/" replace />;

  return children;
};

// Header Component
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiHeadphones} className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AudioGuide</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/catalog" className="text-gray-700 hover:text-primary-600 transition-colors">Catalog</Link>
            {user && (
              <Link to="/library" className="text-gray-700 hover:text-primary-600 transition-colors">My Library</Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <SafeIcon icon={FiIcons.FiUser} className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/library" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Library</Link>
                  {isAdmin() && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth"><Button>Sign In</Button></Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Footer Component
export const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiHeadphones} className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AudioGuide</span>
          </div>
          <p className="text-gray-400">Discover the world through immersive audio experiences.</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/catalog" className="text-gray-400 hover:text-white transition-colors">Catalog</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">support@audioguide.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2024 AudioGuide. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main Layout
export const Layout = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Admin Layout
export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const navItems = [
    { path: '/admin', icon: FiIcons.FiHome, label: 'Dashboard' },
    { path: '/admin/products', icon: FiIcons.FiPackage, label: 'Products' },
    { path: '/admin/users', icon: FiIcons.FiUsers, label: 'Users' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiHeadphones} className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiIcons.FiLogOut} className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Error Boundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened.</p>
            <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}