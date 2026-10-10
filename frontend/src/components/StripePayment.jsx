// frontend/src/components/StripePayment.jsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import API from '../api/axios';
import toast from 'react-hot-toast';

// REAL STRIPE CHECKOUT FORM
const CheckoutForm = ({ onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await API.post('/payments/confirm/', {
          payment_intent_id: paymentIntent.id,
        }).catch(() => {});
        toast.success('Payment successful! 🎉');
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
      toast.error('Payment failed');
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-[#0A0A0A] rounded-xl p-5 border border-gray-dark">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMessage && (
        <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg text-sm">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-2 text-gray-light text-xs">
        <FaLock className="text-gold" />
        <span>Secured by Stripe • Your payment info is encrypted</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gold text-dark py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
      >
        {isProcessing ? 'Processing...' : <><FaCreditCard /> Pay ${amount.toFixed(2)}</>}
      </button>
    </form>
  );
};

// DEMO CHECKOUT FORM (Fallback)
const DemoCheckoutForm = ({ onSuccess, amount, backendError }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Demo Payment successful! 🎉');
      onSuccess({ id: `pi_demo_${Date.now()}` });
    }, 1500);
  };

  return (
    <form onSubmit={handleDemoSubmit} className="space-y-5">
      <div className="bg-error/10 border border-error/30 text-error p-3 rounded-lg text-xs flex items-start gap-2">
        <FaExclamationTriangle className="text-lg shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Running in Demo Payment Mode</p>
          <p className="text-gray-light text-[11px] mt-0.5">{backendError || 'Stripe configuration check failed'}</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl p-5 border border-gray-dark space-y-4">
        <div>
          <label className="text-gray-light text-xs uppercase font-bold mb-1 block">Card Number</label>
          <input 
            type="text" value="4242 •••• •••• 4242" readOnly
            className="w-full bg-[#0A0A0A] border border-gray-dark rounded py-2 px-3 text-white text-sm outline-none cursor-not-allowed opacity-75"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-light text-xs uppercase font-bold mb-1 block">Expiry</label>
            <input 
              type="text" value="12/28" readOnly
              className="w-full bg-[#0A0A0A] border border-gray-dark rounded py-2 px-3 text-white text-sm outline-none cursor-not-allowed opacity-75"
            />
          </div>
          <div>
            <label className="text-gray-light text-xs uppercase font-bold mb-1 block">CVC</label>
            <input 
              type="text" value="123" readOnly
              className="w-full bg-[#0A0A0A] border border-gray-dark rounded py-2 px-3 text-white text-sm outline-none cursor-not-allowed opacity-75"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-light text-xs">
        <FaLock className="text-gold" />
        <span>Demo Mode • Click below to complete order simulation</span>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gold text-dark py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <><FaCreditCard /> Pay ${amount.toFixed(2)} (Demo)</>
        )}
      </button>
    </form>
  );
};

// MAIN STRIPE COMPONENT
const StripePayment = ({ 
  amount, 
  customerInfo, 
  paymentType = 'order',
  referenceId,
  metadata = {},
  onSuccess, 
  onCancel 
}) => {
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [backendError, setBackendError] = useState('');

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      // 1. Get Publishable Key
      const configRes = await API.get('/payments/config/');
      const pubKey = configRes.data?.publishable_key;

      if (!pubKey || !pubKey.startsWith('pk_')) {
        throw new Error("Publishable key missing or invalid in backend settings.");
      }

      const stripe = loadStripe(pubKey);
      setStripePromise(stripe);

      // 2. Create Payment Intent
      const response = await API.post('/payments/create-intent/', {
        amount: amount,
        payment_type: paymentType,
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        reference_id: referenceId,
        metadata: {
          customer_phone: customerInfo.phone || '',
          shipping_address: customerInfo.address || '',
          ...metadata,
        },
      });

      if (!response.data?.client_secret) {
        throw new Error("Client secret missing in backend response.");
      }

      setClientSecret(response.data.client_secret);
    } catch (error) {
      const errDetail = error.response?.data?.error || error.message || "Connection failed";
      console.warn('⚠️ Stripe Checkout Fallback to Demo Mode:', errDetail);
      setBackendError(errDetail);
      setIsDemoMode(true);
    }
    setLoading(false);
  };

  const handleSuccess = (paymentIntent) => {
    setPaymentComplete(true);
    if (onSuccess) {
      onSuccess(paymentIntent);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-light text-sm">Initializing payment gateway...</p>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-success text-4xl" />
        </div>
        <h3 className="text-2xl font-heading font-extrabold text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-light text-sm mb-6">
          Thank you, {customerInfo.name}!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {isDemoMode || !clientSecret || !stripePromise ? (
        <DemoCheckoutForm onSuccess={handleSuccess} amount={amount} backendError={backendError} />
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
          <CheckoutForm onSuccess={handleSuccess} amount={amount} />
        </Elements>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full border border-gray-dark text-gray-light py-3 rounded-lg font-medium hover:border-gold hover:text-gold transition-colors text-sm"
        >
          ← Cancel
        </button>
      )}
    </div>
  );
};

export default StripePayment;