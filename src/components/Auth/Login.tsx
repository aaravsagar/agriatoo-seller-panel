import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { Eye, EyeOff, Loader, Leaf } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Redirect to seller dashboard if already authenticated
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !loading) {
        navigate('/seller', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, try to find the user in Firestore using email
      const usersCollection = 'users';
      let userId: string | null = null;

      // Query to check if user exists - we'll do a simple check by trying to fetch with uid first
      // But we need to find uid by email, so we'll attempt login first and then verify
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      userId = userCredential.user.uid;

      // Now verify that this user exists in Firestore
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // User authenticated in Firebase but doesn't exist in Firestore - not allowed
        await auth.signOut();
        setError('Access denied. Your account is not registered as a seller. Please contact support.');
        return;
      }

      // User exists in Firestore, redirect will happen via auth state change
      // Navigation will be handled by useAuth hook and auth state listener
    } catch (error: any) {
      // Handle different error types
      if (error.code === 'auth/user-not-found') {
        setError('Email not found. Please contact the administrator to register.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Invalid password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Left side - Branding */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="/assets/icon.jpeg" alt="AGRIATOO" className="w-14 h-14 object-cover" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AGRIATOO</h1>
            <p className="text-green-100 text-sm font-medium">Seller Panel</p>
            <p className="text-green-50 text-xs mt-4 leading-relaxed">
              Grow your agricultural business with India's trusted marketplace
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Sign in to your seller account to manage your products and orders
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="seller@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Don't have an account?</strong> Contact your administrator to register as a seller on AGRIATOO.
              </p>
            </div>

            <p className="text-xs text-gray-600 text-center mt-8">
              By continuing, you agree to AGRIATOO's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Easy Setup</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Grow Sales</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Support 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;