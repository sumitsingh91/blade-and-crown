// frontend/src/components/Cart.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import StripePayment from './StripePayment';

const Cart = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, details, payment, success
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
  });

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.customer_phone ||
      !formData.shipping_address
    ) {
      toast.error('Please fill all required fields');
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePaymentSuccess = (paymentIntent) => {
    const trackingId = `BC-${Date.now().toString().slice(-8)}`;
    setOrderSuccess({
      orderId: paymentIntent.id ? paymentIntent.id.slice(-8).toUpperCase() : trackingId,
      trackingId: trackingId,
      total: totalPrice,
      email: formData.customer_email,
    });
    clearCart();
    setCheckoutStep('success');
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    setOrderSuccess(null);
    onClose();
  };

  const getTitle = () => {
    switch (checkoutStep) {
      case 'details':
        return 'SHIPPING DETAILS';
      case 'payment':
        return 'PAYMENT';
      case 'success':
        return 'ORDER CONFIRMED';
      default:
        return `YOUR CART (${totalItems})`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-9998"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-gold/30 z-9999 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-dark bg-[#0A0A0A] relative z-10">
              <div className="flex items-center gap-3">
                <FaShoppingBag className="text-gold text-xl" />
                <h2 className="text-xl font-heading font-extrabold text-white tracking-wide">
                  {getTitle()}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-card border border-gray-dark flex items-center justify-center text-gray-light hover:text-gold hover:border-gold transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto bg-[#0A0A0A]">
              {/* SUCCESS STATE */}
              {checkoutStep === 'success' && orderSuccess && (
                <div className="p-6 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto">
                    <span className="text-4xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-extrabold text-white mb-2">
                      PAYMENT SUCCESSFUL!
                    </h3>
                    <p className="text-gray-light text-sm">
                      Confirmation email sent to {orderSuccess.email}
                    </p>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-xl p-5 border border-gold/30 text-left space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-light text-sm">Order ID:</span>
                      <span className="text-gold font-bold">{orderSuccess.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light text-sm">Tracking ID:</span>
                      <span className="text-white font-mono font-bold">
                        {orderSuccess.trackingId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light text-sm">Total Paid:</span>
                      <span className="text-gold font-bold text-lg">
                        ${orderSuccess.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full bg-gold text-dark py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

              {/* PAYMENT STEP */}
              {checkoutStep === 'payment' && (
                <div className="p-6">
                  <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gold/30 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total Amount</span>
                      <span className="text-gold font-extrabold text-xl">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <StripePayment
                    amount={totalPrice}
                    customerInfo={{
                      name: formData.customer_name,
                      email: formData.customer_email,
                      phone: formData.customer_phone,
                      address: formData.shipping_address,
                    }}
                    paymentType="order"
                    referenceId={`ORDER-${Date.now()}`}
                    metadata={{
                      items_summary: cartItems.map((i) => `${i.name} x${i.quantity}`).join(', '),
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setCheckoutStep('details')}
                  />
                </div>
              )}

              {/* DETAILS STEP */}
              {checkoutStep === 'details' && (
                <form onSubmit={handleDetailsSubmit} className="p-6 space-y-4">
                  <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-dark mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-light">Items ({totalItems})</span>
                      <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-light">Shipping</span>
                      <span className="text-success font-bold">FREE</span>
                    </div>
                    <hr className="border-gray-dark my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-gold font-extrabold text-xl">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {[
                    { key: 'customer_name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                    { key: 'customer_email', label: 'Email Address', type: 'email', placeholder: 'john@email.com' },
                    { key: 'customer_phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 123-4567' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-white text-xs font-bold uppercase tracking-wider mb-1 block">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                        className="w-full bg-[#1A1A1A] border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors text-sm"
                        placeholder={field.placeholder}
                        required
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-white text-xs font-bold uppercase tracking-wider mb-1 block">
                      Shipping Address
                    </label>
                    <textarea
                      value={formData.shipping_address}
                      onChange={(e) =>
                        setFormData({ ...formData, shipping_address: e.target.value })
                      }
                      rows={3}
                      className="w-full bg-[#1A1A1A] border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors resize-none text-sm"
                      placeholder="Street, City, State, ZIP"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 border border-gold text-gold py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-gold hover:text-dark transition-colors text-sm"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gold text-dark py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors text-sm"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </form>
              )}

              {/* CART ITEMS STEP */}
              {checkoutStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-87.5">
                      <FaShoppingBag className="text-gold/20 text-6xl mb-4" />
                      <h3 className="text-xl font-heading font-bold text-white mb-2">
                        YOUR CART IS EMPTY
                      </h3>
                      <p className="text-gray-light text-sm mb-6">
                        Explore our grooming store and add products to your cart.
                      </p>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="bg-gold text-dark px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors text-sm"
                      >
                        Browse Store
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-dark flex gap-4 items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-gold/20"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate">
                              {item.name}
                            </h4>
                            <p className="text-gold font-bold mt-1 text-base">
                              ${Number(item.price).toFixed(2)}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 bg-[#0A0A0A] border border-gray-dark rounded-lg p-1">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-gray-light hover:text-gold hover:bg-card transition-colors"
                                >
                                  <FaMinus className="text-[10px]" />
                                </button>
                                <span className="text-white font-bold text-xs w-5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-gray-light hover:text-gold hover:bg-card transition-colors"
                                >
                                  <FaPlus className="text-[10px]" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  removeFromCart(item.id);
                                  toast.success('Item removed');
                                }}
                                className="text-gray-light hover:text-error transition-colors p-1"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          clearCart();
                          toast.success('Cart cleared');
                        }}
                        className="w-full text-gray-light hover:text-error text-xs font-medium uppercase tracking-wider py-2 transition-colors text-center block"
                      >
                        Clear All Items
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-dark bg-[#0A0A0A] space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-light text-sm uppercase tracking-wider font-medium">
                    Subtotal
                  </span>
                  <span className="text-gold font-extrabold text-2xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="w-full bg-gold text-dark py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors text-sm shadow-lg shadow-gold/10"
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Cart;