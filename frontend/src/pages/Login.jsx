// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCut, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (error) {
      const errData = error.response?.data;
      let message = 'Login failed';

      if (errData) {
        if (errData.non_field_errors) {
          message = errData.non_field_errors[0];
        } else if (typeof errData === 'object') {
          const firstKey = Object.keys(errData)[0];
          const firstError = Array.isArray(errData[firstKey])
            ? errData[firstKey][0]
            : errData[firstKey];
          message = firstError;
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
        className="w-full max-w-md"
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
              Welcome <span className="text-gold">Back</span>
            </h1>
            <p className="text-gray-light text-sm">
              Sign in to book your next appointment
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-gold text-sm hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-dark py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-dark" />
            <span className="px-4 text-gray-light text-xs uppercase">OR</span>
            <div className="flex-1 h-px bg-gray-dark" />
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-light text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-gold font-bold hover:underline"
            >
              Sign up
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

export default Login;