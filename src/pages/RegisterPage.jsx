import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!image) {
      setError('Please upload a profile photo');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authAPI.register(name.trim(), image);
      setUser(data, data.token);
      navigate('/swipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          Join the Crush 💕
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative mb-4"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                  >
                    ×
                  </button>
                </motion.div>
              ) : (
                <label className="w-full cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-500">Click to upload your photo</p>
                    <p className="text-gray-400 text-sm mt-1">Max 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              )}
            </div>
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
            {isLoading ? 'Creating profile...' : 'Start Swiping!'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
