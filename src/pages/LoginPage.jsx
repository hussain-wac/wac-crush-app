import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await authAPI.login(credentialResponse.credential);
      setUser(data, data.token);
      navigate('/swipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-primary to-purple-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back!
        </h2>

        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Sign in with your Google account to continue
          </p>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Signing in...</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed')}
                useOneTap={false}
                shape="rectangular"
                size="large"
                text="signin_with"
                width="300"
              />
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
        </div>

        <p className="mt-6 text-center text-gray-600">
          New here?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
