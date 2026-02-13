import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import useStore from '../store/useStore';
import { authAPI } from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';

const TOTAL_STEPS = 3;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

function ToggleButton({ label, emoji, isActive, activeClass, onClick, disabled }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-3 sm:py-3.5 px-3 rounded-xl font-medium text-sm sm:text-base transition-all cursor-pointer ${
        isActive
          ? `${activeClass} shadow-lg`
          : 'bg-white/[0.06] border border-white/10 text-white/60 hover:bg-white/10'
      }`}
    >
      {emoji && <span className="mr-1">{emoji}</span>}
      {label}
    </motion.button>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 24 : 8,
            backgroundColor: i === current ? '#ff4b6e' : i < current ? '#a855f7' : 'rgba(255,255,255,0.15)',
          }}
          className="h-2 rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      ))}
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/swipe', { replace: true });
  }, [isAuthenticated, navigate]);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [preference, setPreference] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [googlePhotoUrl, setGooglePhotoUrl] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleEmail, setGoogleEmail] = useState('');

  const goNext = () => {
    setError('');
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setError('');
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setGooglePhotoUrl(null);
      setError('');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setGoogleEmail(decoded.email);
      setGoogleCredential(credentialResponse.credential);
      if (decoded.name && !name) {
        setName(decoded.name);
      }
      // Prefill profile photo from Google
      if (decoded.picture) {
        setGooglePhotoUrl(decoded.picture);
        setImagePreview(decoded.picture);
      }
      setError('');
      // Auto-advance to step 2
      setTimeout(() => {
        setDirection(1);
        setStep(1);
      }, 400);
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Failed to process Google sign-in');
    }
  };

  const validateStep = () => {
    if (step === 0) {
      if (!googleCredential) { setError('Please sign in with Google first'); return false; }
    }
    if (step === 1) {
      if (!name.trim()) { setError('Please enter your name'); return false; }
      if (!gender) { setError('Please select your gender'); return false; }
    }
    if (step === 2) {
      if (!preference) { setError('Please select who you are interested in'); return false; }
      if (!image && !googlePhotoUrl) { setError('Please upload a profile photo'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) goNext();
  };

  const handleSubmit = async () => {
    setError('');
    if (!validateStep()) return;

    setIsLoading(true);

    try {
      // If using Google photo (no file uploaded), fetch it as a blob
      let imageFile = image;
      if (!imageFile && googlePhotoUrl) {
        const res = await fetch(googlePhotoUrl);
        const blob = await res.blob();
        imageFile = new File([blob], 'google-photo.jpg', { type: blob.type });
      }

      const data = await authAPI.register(googleCredential, name.trim(), imageFile, gender, preference);
      setUser(data, data.token);
      navigate('/swipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return !!googleCredential;
    if (step === 1) return name.trim() && gender;
    if (step === 2) return preference && (image || googlePhotoUrl);
    return false;
  };

  return (
    <AnimatedBackground variant="dark">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={step > 0 ? goBack : () => navigate('/')}
          className="self-start mb-4 sm:mb-6 ml-0 sm:ml-[calc(50%-14rem)] w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="w-full max-w-md sm:max-w-lg backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-3xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-4xl sm:text-5xl block mb-2"
            >
              💘
            </motion.span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Join the Crush
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {step === 0 && 'Connect your account to get started'}
              {step === 1 && 'Tell us about yourself'}
              {step === 2 && 'Almost there! Final details'}
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator current={step} total={TOTAL_STEPS} />

          {/* Step Content */}
          <div className="relative overflow-hidden min-h-[280px] sm:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1: Google Sign-In */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/[0.06] flex items-center justify-center">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <p className="text-white/50 text-sm mb-6">
                      Sign in with Google to verify your identity
                    </p>
                  </div>

                  {googleCredential ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3 p-4 bg-green-500/15 border border-green-500/30 rounded-xl"
                    >
                      {googlePhotoUrl && (
                        <img src={googlePhotoUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-green-400 font-medium text-sm">Connected</p>
                        <p className="text-green-400/60 text-xs truncate">{googleEmail}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="flex justify-center bg-white rounded-xl p-3">
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
                </motion.div>
              )}

              {/* Step 2: Name & Gender */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-white/[0.06] border border-white/15 rounded-xl text-white placeholder-white/30 focus:border-primary/60 focus:bg-white/10 focus:outline-none transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      I am a
                    </label>
                    <div className="flex gap-2.5">
                      <ToggleButton
                        label="Boy"
                        emoji="👦"
                        isActive={gender === 'boy'}
                        activeClass="bg-blue-500 text-white"
                        onClick={() => setGender('boy')}
                        disabled={isLoading}
                      />
                      <ToggleButton
                        label="Girl"
                        emoji="👧"
                        isActive={gender === 'girl'}
                        activeClass="bg-pink-500 text-white"
                        onClick={() => setGender('girl')}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preference & Photo */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Interested in
                    </label>
                    <div className="flex gap-2.5">
                      <ToggleButton
                        label="Boys"
                        emoji="👦"
                        isActive={preference === 'boy'}
                        activeClass="bg-blue-500 text-white"
                        onClick={() => setPreference('boy')}
                        disabled={isLoading}
                      />
                      <ToggleButton
                        label="Girls"
                        emoji="👧"
                        isActive={preference === 'girl'}
                        activeClass="bg-pink-500 text-white"
                        onClick={() => setPreference('girl')}
                        disabled={isLoading}
                      />
                      <ToggleButton
                        label="Both"
                        emoji="💜"
                        isActive={preference === 'both'}
                        activeClass="bg-purple-500 text-white"
                        onClick={() => setPreference('both')}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Profile Photo
                    </label>
                    <div className="flex flex-col items-center">
                      <AnimatePresence mode="wait">
                        {imagePreview ? (
                          <motion.div
                            key="preview"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="relative"
                          >
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-pink-400 to-purple-500 opacity-70" />
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="relative w-full h-full rounded-full object-cover border-2 border-gray-900"
                              />
                            </div>
                            {/* Change photo button */}
                            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full flex items-center justify-center text-sm cursor-pointer hover:bg-white/25 transition-colors">
                              📷
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isLoading}
                              />
                            </label>
                            {googlePhotoUrl && imagePreview !== googlePhotoUrl && (
                              <button
                                type="button"
                                onClick={() => { setImage(null); setImagePreview(null); setGooglePhotoUrl(null); }}
                                className="absolute -top-1 -left-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-400 transition-colors cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                            {googlePhotoUrl && imagePreview === googlePhotoUrl && (
                              <p className="text-white/30 text-xs text-center mt-2">From your Google account</p>
                            )}
                          </motion.div>
                        ) : (
                          <motion.label
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full cursor-pointer group"
                          >
                            <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 sm:p-8 text-center group-hover:border-primary/40 group-hover:bg-white/[0.03] transition-all">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-white/[0.06] flex items-center justify-center">
                                <span className="text-2xl sm:text-3xl">📷</span>
                              </div>
                              <p className="text-white/50 text-sm">Tap to upload your photo</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={isLoading}
                            />
                          </motion.label>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-xl mt-4"
              >
                <span className="text-red-400 text-sm shrink-0">!</span>
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={goBack}
                className="px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white/60 font-medium hover:bg-white/10 transition-all cursor-pointer text-sm sm:text-base"
              >
                Back
              </motion.button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <motion.button
                type="button"
                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-xl shadow-[0_8px_32px_rgba(255,75,110,0.3)] hover:shadow-[0_8px_40px_rgba(255,75,110,0.5)] transition-all disabled:opacity-30 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Continue
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={isLoading || !canProceed()}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-xl shadow-[0_8px_32px_rgba(255,75,110,0.3)] hover:shadow-[0_8px_40px_rgba(255,75,110,0.5)] transition-all disabled:opacity-30 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="inline-block"
                    >
                      💫
                    </motion.span>
                    Creating profile...
                  </span>
                ) : (
                  'Start Swiping!'
                )}
              </motion.button>
            )}
          </div>

          {/* Login link */}
          <p className="mt-5 text-center">
            <span className="text-white/30 text-sm">Already registered? </span>
            <Link to="/login" className="text-primary/80 text-sm font-medium hover:text-primary transition-colors">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}

export default RegisterPage;
