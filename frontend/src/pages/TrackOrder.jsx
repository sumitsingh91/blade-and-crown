// frontend/src/pages/TrackOrder.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCut, FaSearch, FaBox, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Demo order database (in real app this comes from backend)
  const demoOrders = {
    // Any BC-XXXXXXXX format will work for demo
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      // Generate demo tracking data based on ID
      const statuses = ['processing', 'shipped', 'delivered'];
      const randomStatus = trackingId.toUpperCase().includes('BC-') 
        ? statuses[Math.floor(Math.random() * 2)] // processing or shipped
        : 'processing';

      setOrderData({
        trackingId: trackingId.toUpperCase(),
        status: randomStatus,
        customer: 'Customer',
        items: [
          { name: 'Premium Hair Pomade', qty: 1, price: 24.99 },
          { name: 'Beard Oil - Sandalwood', qty: 1, price: 18.99 },
        ],
        total: 43.98,
        placedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
          'en-US',
          { year: 'numeric', month: 'long', day: 'numeric' }
        ),
        timeline: [
          {
            status: 'Order Placed',
            description: 'Your order has been received',
            time: 'Just now',
            done: true,
            icon: <FaCheckCircle />,
          },
          {
            status: 'Processing',
            description: 'We are preparing your items',
            time: 'In progress',
            done: true,
            icon: <FaBox />,
          },
          {
            status: 'Shipped',
            description: 'Package is on the way',
            time: randomStatus === 'shipped' || randomStatus === 'delivered' ? 'Today' : 'Pending',
            done: randomStatus === 'shipped' || randomStatus === 'delivered',
            icon: <FaTruck />,
          },
          {
            status: 'Delivered',
            description: 'Package delivered successfully',
            time: randomStatus === 'delivered' ? 'Today' : 'Pending',
            done: randomStatus === 'delivered',
            icon: <FaCheckCircle />,
          },
        ],
      });
      setIsSearching(false);
      toast.success('Order found!');
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-gold/20 text-gold';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400';
      case 'delivered':
        return 'bg-success/20 text-success';
      default:
        return 'bg-gray-dark text-gray-light';
    }
  };

  return (
    <div className="min-h-screen bg-dark py-12 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <FaCut className="text-gold text-2xl" />
          <span className="text-xl font-heading font-extrabold text-white">
            BLADE <span className="text-gold">&</span> CROWN
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-heading font-extrabold text-white mb-3">
            Track Your <span className="text-gold">Order</span>
          </h1>
          <div className="w-16 h-1 bg-gold mx-auto mb-3" />
          <p className="text-gray-light">
            Enter your tracking ID to check order status
          </p>
        </motion.div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. BC-12345678"
                className="w-full bg-card border border-gray-dark rounded-lg pl-12 pr-4 py-4 text-white focus:border-gold focus:outline-none transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-gold text-dark px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {isSearching ? '...' : 'Track'}
            </button>
          </div>
        </form>

        {/* Order Result */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-card rounded-xl p-6 border border-gold/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-light text-sm">Tracking ID</p>
                  <p className="text-white font-mono font-bold text-lg">
                    {orderData.trackingId}
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusColor(
                    orderData.status
                  )}`}
                >
                  {orderData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-light">Order Date</p>
                  <p className="text-white font-medium">{orderData.placedAt}</p>
                </div>
                <div>
                  <p className="text-gray-light">Est. Delivery</p>
                  <p className="text-white font-medium">{orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card rounded-xl p-6 border border-gray-dark">
              <h3 className="text-white font-heading font-bold text-lg mb-6 flex items-center gap-2">
                <FaClock className="text-gold" /> Tracking Timeline
              </h3>

              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute  top-2 bottom-2 w-0.5 bg-gray-dark" />

                <div className="space-y-6">
                  {orderData.timeline.map((step, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center  z-10 text-sm ${
                          step.done
                            ? 'bg-gold text-dark'
                            : 'bg-gray-dark text-gray-light border border-gray-light'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`font-bold ${
                              step.done ? 'text-white' : 'text-gray-light'
                            }`}
                          >
                            {step.status}
                          </p>
                          <span className="text-gray-light text-xs">{step.time}</span>
                        </div>
                        <p className="text-gray-light text-sm mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card rounded-xl p-6 border border-gray-dark">
              <h3 className="text-white font-heading font-bold text-lg mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {orderData.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-light">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-white font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                <hr className="border-gray-dark" />
                <div className="flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-gold font-bold text-lg">
                    ${orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-gray-light hover:text-gold transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;