// frontend/src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCut, FaUser, FaEnvelope, FaLock,
  FaEye, FaEyeSlash, FaPhone
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created! Welcome to Blade & Crown! 🎉');
      navigate('/');
    } catch (error) {
      const errData = error.response?.data;
      let message = 'Registration failed';

      if (errData) {
        if (typeof errData === 'object') {
          const firstKey = Object.keys(errData)[0];
          const firstError = Array.isArray(errData[firstKey])
            ? errData[firstKey][0]
            : errData[firstKey];
          message = `${firstKey}: ${firstError}`;
        }
      }

      toast.error(message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-dark py-12 px-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.95)), url('https://images.unsplash.com/photo-1585747860019-8623f53a1504?w=1920')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card/90 backdrop-blur-md rounded-2xl p-8 border border-gold/20 shadow-2xl shadow-gold/10">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <FaCut className="text-gold text-2xl" />
            <span className="text-xl font-heading font-extrabold text-white">
              BLADE <span className="text-gold">&</span> CROWN
            </span>
          </Link>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-extrabold text-white mb-2">
              Create <span className="text-gold">Account</span>
            </h1>
            <p className="text-gray-light text-sm">
              Join the Blade & Crown family today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg pl-12 pr-12 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="At least 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-light hover:text-gold"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  className="w-full bg-dark border border-gray-dark rounded-lg pl-12 pr-12 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-light hover:text-gold"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="mt-1 accent-gold"
              />
              <p className="text-gray-light text-xs">
                I agree to the{' '}
                <a href="#" className="text-gold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-gold hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-dark py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-dark" />
            <span className="px-4 text-gray-light text-xs uppercase">OR</span>
            <div className="flex-1 h-px bg-gray-dark" />
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-light text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-gold font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Back to Home */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-gray-light text-xs hover:text-gold transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;