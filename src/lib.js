/**
 * SUPABASE & AUTHENTICATION LIBRARY
 * Consolidated database operations and authentication
 */
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://wyiclimtqdgmjwlhtkqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aWNsaW10cWRnbWp3bGh0a3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNDUyNzYsImV4cCI6MjA2NjYyMTI3Nn0.PWSQmejUsXSrFMKlFB6FRVX_s6J7ANiFEfrDMdxlQv0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Demo admin credentials
const ADMIN_DEMO = {
  email: 'admin@audioguide.com',
  password: 'admin123',
  user: {
    id: 'demo-admin',
    email: 'admin@audioguide.com',
    user_metadata: { role: 'admin' }
  }
};

// Session management
let currentSession = null;
const mockFileStorage = new Map();

// Authentication helpers
const createSession = (user) => {
  const session = {
    user,
    expiresAt: Date.now() + 86400000 // 24h
  };
  currentSession = session;
  localStorage.setItem('auth', JSON.stringify(session));
  return session;
};

const clearSession = () => {
  currentSession = null;
  localStorage.removeItem('auth');
  localStorage.removeItem('library');
  mockFileStorage.clear();
};

export const getCurrentUser = () => {
  if (currentSession) return currentSession.user;
  
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const auth = JSON.parse(stored);
      if (auth.user && auth.expiresAt > Date.now()) {
        currentSession = auth;
        return auth.user;
      }
    }
  } catch (e) {
    console.error('Auth error:', e);
  }
  
  return null;
};

// Authentication functions
export const signIn = async (email, password) => {
  try {
    // Check demo admin
    if (email === ADMIN_DEMO.email && password === ADMIN_DEMO.password) {
      const session = createSession(ADMIN_DEMO.user);
      return { data: { user: ADMIN_DEMO.user, session }, error: null };
    }
    
    // Real Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    if (data.user) createSession(data.user);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    
    if (data.user) createSession(data.user);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    clearSession();
    await supabase.auth.signOut();
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// File upload (mock implementation)
export const uploadFile = async (bucket, path, file) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Authentication required');
  
  const timestamp = Date.now();
  const fileName = `${timestamp}_${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
  const fullPath = `${path}/${fileName}`;
  
  // Convert to base64 for mock storage
  const reader = new FileReader();
  const dataUrl = await new Promise(resolve => {
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
  
  mockFileStorage.set(fullPath, {
    data: dataUrl,
    type: file.type,
    size: file.size
  });
  
  return { data: { path: fullPath }, error: null };
};

export const getPublicUrl = (bucket, path) => {
  const file = mockFileStorage.get(path);
  return file ? file.data : `https://wyiclimtqdgmjwlhtkqn.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};

// Database operations
const ensureAuth = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error('Authentication required');
  return user;
};

export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products_audioguide')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllProducts = async () => {
  await ensureAuth();
  const { data, error } = await supabase
    .from('products_audioguide')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from('products_audioguide')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createProduct = async (productData) => {
  await ensureAuth();
  const { data, error } = await supabase
    .from('products_audioguide')
    .insert([productData])
    .select()
    .single();
  return { data, error };
};

export const updateProduct = async (id, productData) => {
  await ensureAuth();
  const { data, error } = await supabase
    .from('products_audioguide')
    .update(productData)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const fetchPOIs = async (productId, languageCode = null) => {
  let query = supabase
    .from('pois_audioguide')
    .select('*')
    .eq('product_id', productId);
  
  if (languageCode) query = query.eq('language_code', languageCode);
  
  return await query.order('language_code,order_index');
};

export const insertPOIsBulk = async (poisData) => {
  await ensureAuth();
  if (!poisData?.length) return { data: [], error: null };
  
  return await supabase
    .from('pois_audioguide')
    .insert(poisData)
    .select();
};

export const deletePOIsByProduct = async (productId, languageCode = null) => {
  await ensureAuth();
  let query = supabase
    .from('pois_audioguide')
    .delete()
    .eq('product_id', productId);
  
  if (languageCode) query = query.eq('language_code', languageCode);
  
  return await query;
};

export const fetchUsers = async () => {
  const user = await ensureAuth();
  if (user.email !== ADMIN_DEMO.email && user.user_metadata?.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  try {
    const { data, error } = await supabase
      .from('users_audioguide')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    // Fallback to localStorage for demo
    const localUsers = JSON.parse(localStorage.getItem('demo-users') || '[]');
    return { data: localUsers, error: null };
  }
};