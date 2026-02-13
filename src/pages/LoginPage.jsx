import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authAPI.login(name.trim());
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
          Welcome Back! 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Continue Swiping!'}
          </button>
        </form>

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
