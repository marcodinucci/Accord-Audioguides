/**
 * ALL PAGES CONSOLIDATED
 * Main application pages in a single file
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore, useLibraryStore } from './store.js';
import { 
  fetchProducts, 
  fetchAllProducts, 
  fetchProductById, 
  fetchPOIs, 
  createProduct, 
  updateProduct, 
  fetchUsers, 
  insertPOIsBulk, 
  deletePOIsByProduct 
} from './lib.js';
import { SafeIcon, Button, Card, LoadingSpinner, FileUpload, RichTextEditor } from './components.jsx';
import * as FiIcons from 'react-icons/fi';

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'de', name: 'German' }
];

// HOME PAGE
export const HomePage = () => {
  const features = [
    {
      icon: FiIcons.FiHeadphones,
      title: 'Premium Audio Quality',
      description: 'Crystal clear narration with professional voice actors.'
    },
    {
      icon: FiIcons.FiGlobe,
      title: 'Multilingual Support',
      description: 'Available in multiple languages worldwide.'
    },
    {
      icon: FiIcons.FiStar,
      title: 'Expert Curation',
      description: 'Crafted by local experts and historians.'
    },
    {
      icon: FiIcons.FiPlay,
      title: 'Offline Access',
      description: 'Download guides for offline use.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              Discover the World <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Through Sound
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
              Immerse yourself in premium audio guides that bring destinations to life with expert narration and captivating stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg"
                >
                  Explore Guides
                  <SafeIcon icon={FiIcons.FiArrowRight} className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AudioGuide?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium audio guide platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SafeIcon icon={feature.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Browse our collection of premium audio guides and start exploring.
          </p>
          <Link to="/catalog">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Start Exploring
              <SafeIcon icon={FiIcons.FiArrowRight} className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

// CATALOG PAGE
export const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const { data, error } = await fetchProducts();
      if (!error) setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Audio Guide Catalog
          </h1>
          <p className="text-xl text-gray-600">
            Discover premium audio guides for destinations worldwide
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <SafeIcon
              icon={FiIcons.FiSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search audio guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} audio guides
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiIcons.FiSearch} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audio guides found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const price = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;

  return (
    <Card hover className="overflow-hidden">
      <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
        {product.cover_image_url && (
          <img
            src={product.cover_image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <SafeIcon icon={FiIcons.FiMapPin} className="w-4 h-4" />
          {product.city}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{product.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">${price}</div>
            {originalPrice && (
              <div className="text-sm text-gray-500 line-through">${originalPrice}</div>
            )}
          </div>
        </div>
        <Link to={`/product/${product.slug || product.id}`}>
          <Button className="w-full" size="sm">View Details</Button>
        </Link>
      </div>
    </Card>
  );
};

// PRODUCT DETAIL PAGE
export const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { isPurchased } = useLibraryStore();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Try to fetch by ID if slug is numeric
      const { data: product, error } = await fetchProductById(slug);
      if (!error && product) {
        setProduct(product);
        const { data: pois } = await fetchPOIs(product.id);
        setPois(pois || []);
      } else {
        // Fallback to mock data for demo
        const mockProducts = {
          '1': { id: '1', title: 'Rome Historical Walk', description: 'Explore ancient Rome', price: 29.99, city: 'Rome' },
          '2': { id: '2', title: 'Paris Art & Culture', description: 'Discover artistic Paris', price: 34.99, discount_price: 24.99, city: 'Paris' },
          '3': { id: '3', title: 'Tokyo Modern Explorer', description: 'Modern Tokyo experience', price: 39.99, city: 'Tokyo' }
        };
        const mockProduct = mockProducts[slug];
        if (mockProduct) setProduct(mockProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/catalog"><Button>Back to Catalog</Button></Link>
      </div>
    </div>
  );

  const price = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;
  const isOwned = isPurchased(product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/catalog" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <SafeIcon icon={FiIcons.FiArrowLeft} className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden">
            {product.cover_image_url && (
              <img
                src={product.cover_image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <SafeIcon icon={FiIcons.FiMapPin} className="w-4 h-4" />
                {product.city}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">High-quality audio narration</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Offline access after purchase</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Interactive maps and images</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">{pois.length} Points of Interest</span>
                </li>
              </ul>
            </div>

            {/* Price and Purchase */}
            <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">${price}</div>
                  {originalPrice && (
                    <div className="text-lg text-gray-500 line-through">${originalPrice}</div>
                  )}
                </div>
                {originalPrice && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Save ${(originalPrice - price).toFixed(2)}
                  </div>
                )}
              </div>

              {isOwned ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <SafeIcon icon={FiIcons.FiCheck} className="w-5 h-5" />
                    <span className="font-medium">You own this guide</span>
                  </div>
                  <Link to={`/guide/${product.id}`}>
                    <Button className="w-full" size="lg">
                      <SafeIcon icon={FiIcons.FiPlay} className="w-5 h-5 mr-2" />
                      Start Listening
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {user ? (
                    <Link to={`/checkout/${product.id}`}>
                      <Button className="w-full" size="lg">Purchase Guide</Button>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full" size="lg">Sign In to Purchase</Button>
                    </Link>
                  )}
                  <p className="text-sm text-gray-500 text-center">One-time purchase • Lifetime access</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// AUTH PAGE
export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  if (user) return <Navigate to="/" replace />;

  const fillDemo = () => {
    setValue('email', 'admin@audioguide.com');
    setValue('password', 'admin123');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isLogin) {
        const result = await signIn(data.email, data.password);
        if (result.error) throw result.error;
        toast.success('Welcome back!');
        navigate('/');
      } else {
        const result = await signUp(data.email, data.password, { full_name: data.fullName });
        if (result.error) throw result.error;
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <SafeIcon icon={FiIcons.FiArrowLeft} className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiIcons.FiHeadphones} className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to access your audio guides' : 'Join AudioGuide to start exploring'}
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 text-center">Demo Account:</p>
              <button
                type="button"
                onClick={fillDemo}
                className="w-full p-3 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm font-medium text-purple-800 transition-colors"
              >
                Administrator (admin@audioguide.com)
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="input-field"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary-600 hover:text-primary-500 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// CHECKOUT PAGE
export const CheckoutPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuthStore();
  const { addPurchasedGuide } = useLibraryStore();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProductById(productId);
      if (data) {
        setProduct(data);
      } else {
        // Mock data fallback
        const mockProducts = {
          '1': { id: '1', title: 'Rome Historical Walk', price: 29.99, cover_image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200' },
          '2': { id: '2', title: 'Paris Art & Culture', price: 34.99, discount_price: 24.99, cover_image_url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200' },
          '3': { id: '3', title: 'Tokyo Modern Explorer', price: 39.99, cover_image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200' }
        };
        setProduct(mockProducts[productId]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !product) return;

    setProcessing(true);
    try {
      // Simulate payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      addPurchasedGuide(product);
      toast.success('Payment successful! Guide added to your library.');
      navigate('/library');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  if (!product) return null;

  const price = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <SafeIcon icon={FiIcons.FiArrowLeft} className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="input-field"
                  disabled={processing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="input-field"
                    disabled={processing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="input-field"
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg mt-6">
              <SafeIcon icon={FiIcons.FiLock} className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Your payment information is secure and encrypted</span>
            </div>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {product.cover_image_url && (
                      <img
                        src={product.cover_image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-600">Digital Audio Guide</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${originalPrice || price}</span>
                  </div>
                  {originalPrice && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${originalPrice - price}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>${price}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={handlePayment}
              loading={processing}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? 'Processing Payment...' : `Complete Purchase - $${price}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// LIBRARY PAGE
export const LibraryPage = () => {
  const { purchasedGuides } = useLibraryStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Library</h1>
          <p className="text-xl text-gray-600">Your purchased audio guides ({purchasedGuides.length})</p>
        </div>

        {purchasedGuides.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiIcons.FiPlay} className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Audio Guides Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your collection of premium audio guides.
            </p>
            <Link to="/catalog">
              <Button size="lg">Browse Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LibraryCard guide={guide} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LibraryCard = ({ guide }) => (
  <Card hover className="overflow-hidden">
    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
      {guide.cover_image_url && (
        <img
          src={guide.cover_image_url}
          alt={guide.title}
          className="w-full h-full object-cover"
        />
      )}
    </div>
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <SafeIcon icon={FiIcons.FiMapPin} className="w-4 h-4" />
        {guide.city || 'Unknown City'}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{guide.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{guide.description}</p>
      <Link to={`/guide/${guide.id}`}>
        <Button className="w-full">
          <SafeIcon icon={FiIcons.FiPlay} className="w-4 h-4 mr-2" />
          Play Guide
        </Button>
      </Link>
    </div>
  </Card>
);

// GUIDE VIEWER PAGE
export const GuideViewerPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [pois, setPois] = useState([]);
  const [currentPoiIndex, setCurrentPoiIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isPurchased } = useLibraryStore();

  useEffect(() => {
    fetchGuideData();
  }, [productId]);

  const fetchGuideData = async () => {
    try {
      setLoading(true);
      const { data: productData } = await fetchProductById(productId);
      if (productData) {
        setProduct(productData);
        const { data: poisData } = await fetchPOIs(productData.id);
        setPois(poisData || []);
      } else {
        // Mock data for demo
        const mockProduct = { id: productId, title: 'Demo Guide', description: 'Sample audio guide' };
        const mockPois = [
          { id: '1', title: 'Starting Point', text_html: '<p>Begin your journey here...</p>', order_index: 0 },
          { id: '2', title: 'Main Attraction', text_html: '<p>The heart of the experience...</p>', order_index: 1 },
          { id: '3', title: 'Final Stop', text_html: '<p>Conclude your tour...</p>', order_index: 2 }
        ];
        setProduct(mockProduct);
        setPois(mockPois);
      }
    } catch (error) {
      console.error('Error fetching guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => navigate('/library')}>Back to Library</Button>
      </div>
    </div>
  );

  if (!isPurchased(product.id)) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">You need to purchase this guide to access it.</p>
        <Button onClick={() => navigate(`/product/${product.id}`)}>View Product</Button>
      </div>
    </div>
  );

  if (pois.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">No Content Available</h2>
        <Button onClick={() => navigate('/library')}>Back to Library</Button>
      </div>
    </div>
  );

  const currentPoi = pois[currentPoiIndex];
  const nextPoi = () => currentPoiIndex < pois.length - 1 && setCurrentPoiIndex(currentPoiIndex + 1);
  const prevPoi = () => currentPoiIndex > 0 && setCurrentPoiIndex(currentPoiIndex - 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/library')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <SafeIcon icon={FiIcons.FiArrowLeft} className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-gray-600">{currentPoiIndex + 1} of {pois.length} • {currentPoi?.title}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Image */}
            <Card className="overflow-hidden">
              <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg">
                {currentPoi?.featured_image_url && (
                  <img
                    src={currentPoi.featured_image_url}
                    alt={currentPoi.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Card>

            {/* Content */}
            <Card>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">{currentPoi?.title}</h2>
                {currentPoi?.text_html && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentPoi.text_html }}
                  />
                )}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={prevPoi}
                disabled={currentPoiIndex === 0}
                variant="outline"
              >
                <SafeIcon icon={FiIcons.FiArrowLeft} className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">{currentPoiIndex + 1} / {pois.length}</span>
              <Button
                onClick={nextPoi}
                disabled={currentPoiIndex === pois.length - 1}
              >
                Next
                <SafeIcon icon={FiIcons.FiArrowRight} className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* POI Navigation */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Points of Interest</h3>
              <div className="space-y-2">
                {pois.map((poi, index) => (
                  <button
                    key={poi.id}
                    onClick={() => setCurrentPoiIndex(index)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      index === currentPoiIndex
                        ? 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentPoiIndex
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="font-medium text-gray-900">{poi.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Progress */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-gray-900">{currentPoiIndex + 1} of {pois.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentPoiIndex + 1) / pois.length) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round(((currentPoiIndex + 1) / pois.length) * 100)}% complete
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADMIN PAGES

// Admin Dashboard
export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [{ data: products }, { data: users }] = await Promise.all([
        fetchAllProducts(),
        fetchUsers()
      ]);
      setStats({
        totalProducts: products?.length || 0,
        totalUsers: users?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <LoadingSpinner size="xl" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your AudioGuide platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiPackage} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registered Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiUsers} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products/new"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiIcons.FiPlus} className="w-8 h-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">Create New Product</p>
                <p className="text-sm text-gray-600">Add a new audio guide</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/products"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiIcons.FiPackage} className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-600">Edit existing products</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiIcons.FiUsers} className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">View Users</p>
                <p className="text-sm text-gray-600">Manage registered users</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

// Admin Products
export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <LoadingSpinner size="xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your audio guide products</p>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
            Create Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <SafeIcon icon={FiIcons.FiPlus} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600 mb-6">Create your first audio guide product to get started.</p>
          <Link to="/admin/products/new">
            <Button>Create First Product</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
                {product.cover_image_url && (
                  <img
                    src={product.cover_image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_published ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                  </Link>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{product.city}</span>
                  <div className="text-lg font-bold text-gray-900">
                    ${product.discount_price || product.price}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Admin Users
export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <LoadingSpinner size="xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">Manage registered users ({users.length} total)</p>
      </div>

      <Card>
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <SafeIcon icon={FiIcons.FiUser} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Yet</h3>
            <p className="text-gray-600">Users will appear here once they register for your platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiIcons.FiUser} className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// Product Editor (Basic)
export const ProductEditorPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditing = productId && productId !== 'new';
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [productData, setProductData] = useState({
    title: '',
    slug: '',
    description: '',
    city: '',
    category: '',
    price: '',
    discount_price: '',
    available_languages: ['en'],
    cover_image_url: '',
    is_published: false
  });

  useEffect(() => {
    if (isEditing) fetchProductData();
  }, [productId, isEditing]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProductById(productId);
      if (data) setProductData(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!productData.title || !productData.city || !productData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      const price = parseFloat(productData.price);
      if (isNaN(price) || price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      const slug = productData.slug.trim() || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        ...productData,
        slug,
        price,
        discount_price: productData.discount_price ? parseFloat(productData.discount_price) : null,
        updated_at: new Date().toISOString()
      };

      if (!isEditing) payload.created_at = new Date().toISOString();

      if (isEditing) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }

      toast.success(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <SafeIcon icon={FiIcons.FiArrowLeft} className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Product' : 'Create Product'}
              </h1>
              <p className="text-gray-600">
                {isEditing ? 'Update product details' : 'Add a new audio guide product'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={saving}>
              Save Product
            </Button>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={productData.title}
                    onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter product title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={productData.slug}
                    onChange={(e) => setProductData(prev => ({ ...prev, slug: e.target.value }))}
                    className="input-field"
                    placeholder="Auto-generated from title"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <RichTextEditor
                value={productData.description}
                onChange={(value) => setProductData(prev => ({ ...prev, description: value }))}
                placeholder="Describe your audio guide"
                rows={6}
              />
            </div>

            {/* Location and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={productData.city}
                  onChange={(e) => setProductData(prev => ({ ...prev, city: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Rome, Paris, Tokyo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={productData.category}
                  onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Historical, Art & Culture"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.price}
                    onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.discount_price}
                    onChange={(e) => setProductData(prev => ({ ...prev, discount_price: e.target.value }))}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
              <FileUpload
                bucket="product-media"
                path="covers"
                accept="image/*"
                onUpload={(file) => {
                  if (file?.url) {
                    setProductData(prev => ({ ...prev, cover_image_url: file.url }));
                    toast.success('Cover image uploaded successfully');
                  }
                }}
                currentFiles={productData.cover_image_url ? [{ name: 'Cover Image', url: productData.cover_image_url }] : []}
                label="Upload Cover Image"
              />
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Languages</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {AVAILABLE_LANGUAGES.map(language => (
                  <label
                    key={language.code}
                    className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={productData.available_languages.includes(language.code)}
                      onChange={(e) => {
                        const languages = productData.available_languages;
                        if (e.target.checked) {
                          setProductData(prev => ({ ...prev, available_languages: [...languages, language.code] }));
                        } else if (languages.length > 1) {
                          setProductData(prev => ({ ...prev, available_languages: languages.filter(l => l !== language.code) }));
                        } else {
                          toast.error('At least one language must be selected');
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm font-medium text-gray-900">{language.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Publishing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productData.is_published}
                  onChange={(e) => setProductData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish this product (make it visible in the catalog)
                </span>
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};