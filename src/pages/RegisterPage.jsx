import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [preference, setPreference] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleEmail, setGoogleEmail] = useState('');

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

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      console.log('Google credential response:', credentialResponse);
      console.log('Credential starts with:', credentialResponse.credential?.substring(0, 10));

      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Decoded token:', decoded);

      setGoogleEmail(decoded.email);
      setGoogleCredential(credentialResponse.credential);
      if (decoded.name && !name) {
        setName(decoded.name);
      }
      setError('');
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Failed to process Google sign-in');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!googleCredential) {
      setError('Please sign in with Google first');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!gender) {
      setError('Please select your gender');
      return;
    }

    if (!preference) {
      setError('Please select who you are interested in');
      return;
    }

    if (!image) {
      setError('Please upload a profile photo');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending credential (first 20 chars):', googleCredential?.substring(0, 20));
      const data = await authAPI.register(googleCredential, name.trim(), image, gender, preference);
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
          Join the Crush
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Google Sign-In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 1: Sign in with Google
            </label>
            {googleCredential ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <p className="text-green-700 font-medium">Connected</p>
                  <p className="text-green-600 text-sm">{googleEmail}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in failed')}
                  useOneTap={false}
                  shape="rectangular"
                  size="large"
                  text="continue_with"
                  width="300"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Display Name
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
              I am a
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGender('boy')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                  gender === 'boy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Boy
              </button>
              <button
                type="button"
                onClick={() => setGender('girl')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                  gender === 'girl'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Girl
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am interested in
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPreference('boy')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                  preference === 'boy'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Boys
              </button>
              <button
                type="button"
                onClick={() => setPreference('girl')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                  preference === 'girl'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Girls
              </button>
              <button
                type="button"
                onClick={() => setPreference('both')}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition ${
                  preference === 'both'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Both
              </button>
            </div>
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
            disabled={isLoading || !googleCredential}
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
