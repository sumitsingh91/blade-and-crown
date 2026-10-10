// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaShoppingBag, FaCalendarAlt, 
  FaStar, FaSignOutAlt, FaCheckCircle, FaClock 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [dashboardData, setDashboardData] = useState({ bookings: [], orders: [] });
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [reviewData, setReviewData] = useState({ rating: 5, review_text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/auth/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.review_text) return toast.error('Please write a review');

    setIsSubmittingReview(true);
    try {
      await API.post('/reviews/list/', {
        customer_name: user.first_name || user.username,
        rating: reviewData.rating,
        review_text: reviewData.review_text,
        badge: 'Regular Client',
        platform: 'website'
      });
      toast.success('Thank you for your review! 🌟');
      setReviewData({ rating: 5, review_text: '' });
      setActiveTab('appointments'); // redirect away from form
    } catch (error) {
      toast.error('Failed to submit review');
    }
    setIsSubmittingReview(false);
  };

  // If not logged in, redirect to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <FaUser /> },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { id: 'orders', label: 'Order History', icon: <FaShoppingBag /> },
    { id: 'review', label: 'Leave a Review', icon: <FaStar /> },
  ];

  if (loading) return <div className="min-h-screen bg-dark pt-32 pb-12 flex justify-center"><div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-dark pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 ">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-dark shadow-xl sticky top-28">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-gold font-heading font-bold text-3xl mb-4">
                {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-white text-center">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-light text-sm text-center">{user?.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gold text-dark'
                      : 'text-gray-light hover:bg-[#2D2D2D] hover:text-white'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors mt-4"
              >
                <FaSignOutAlt /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-2xl font-heading font-extrabold text-white mb-6 flex items-center gap-2">
                  <FaUser className="text-gold" /> Personal Information
                </h3>
                <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border border-gray-dark">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-light text-xs font-bold uppercase tracking-wider mb-1 block">Username</label>
                      <p className="bg-[#0A0A0A] border border-gray-dark rounded-lg px-4 py-3 text-white text-sm">{user?.username}</p>
                    </div>
                    <div>
                      <label className="text-gray-light text-xs font-bold uppercase tracking-wider mb-1 block">Email</label>
                      <p className="bg-[#0A0A0A] border border-gray-dark rounded-lg px-4 py-3 text-white text-sm">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-light text-xs font-bold uppercase tracking-wider mb-1 block">First Name</label>
                      <p className="bg-[#0A0A0A] border border-gray-dark rounded-lg px-4 py-3 text-white text-sm">{user?.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-gray-light text-xs font-bold uppercase tracking-wider mb-1 block">Phone</label>
                      <p className="bg-[#0A0A0A] border border-gray-dark rounded-lg px-4 py-3 text-white text-sm">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-heading font-extrabold text-white mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-gold" /> Booking History
                </h3>
                {dashboardData.bookings.length === 0 ? (
                  <div className="bg-[#1A1A1A] rounded-2xl p-10 text-center border border-gray-dark">
                    <p className="text-gray-light">No appointments found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.bookings.map((booking) => (
                      <div key={booking.id} className="bg-[#1A1A1A] rounded-xl p-5 border border-gray-dark flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h4 className="text-white font-bold">{booking.service_detail?.name || 'Service'}</h4>
                          <p className="text-gold text-sm">with {booking.barber_detail?.name || 'Barber'}</p>
                          <div className="flex items-center gap-2 mt-2 text-gray-light text-xs">
                            <FaClock /> {booking.date} at {booking.time.substring(0,5)}
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-white font-bold text-lg">${booking.total_price}</p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            booking.status === 'completed' ? 'bg-success/20 text-success' : 'bg-gold/20 text-gold'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-heading font-extrabold text-white mb-6 flex items-center gap-2">
                  <FaShoppingBag className="text-gold" /> Store Orders
                </h3>
                {dashboardData.orders.length === 0 ? (
                  <div className="bg-[#1A1A1A] rounded-2xl p-10 text-center border border-gray-dark">
                    <p className="text-gray-light">No store orders found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.orders.map((order) => (
                      <div key={order.id} className="bg-[#1A1A1A] rounded-xl p-5 border border-gray-dark">
                        <div className="flex justify-between items-start border-b border-[#2D2D2D] pb-3 mb-3">
                          <div>
                            <p className="text-gray-light text-xs uppercase">Order #{order.id}</p>
                            <p className="text-white text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gold font-bold">${order.total_amount}</p>
                            <span className="text-success text-xs font-bold uppercase">{order.status}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-white">{item.product_name} <span className="text-gray-light">x{item.quantity}</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* REVIEW TAB */}
            {activeTab === 'review' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-2xl font-heading font-extrabold text-white mb-6 flex items-center gap-2">
                  <FaStar className="text-gold" /> Share Your Experience
                </h3>
                <form onSubmit={handleReviewSubmit} className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border border-gray-dark space-y-6">
                  <div>
                    <label className="text-gray-light text-xs font-bold uppercase tracking-wider mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: num})}
                          className={`text-2xl transition-colors ${reviewData.rating >= num ? 'text-gold' : 'text-gray-dark'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-light text-xs font-bold uppercase tracking-wider mb-2 block">Your Review</label>
                    <textarea
                      rows="5"
                      value={reviewData.review_text}
                      onChange={(e) => setReviewData({...reviewData, review_text: e.target.value})}
                      className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your experience..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-gold text-dark px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Profile;