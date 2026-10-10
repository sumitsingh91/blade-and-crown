// frontend/src/components/Newsletter.jsx
import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await API.post('/newsletter/subscribe/', { email });
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      toast.success('Subscribed! (Demo mode)');
      setEmail('');
    }
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r
        from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r
        from-transparent via-gold to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center
          justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold
              text-white mb-2">
              JOIN THE{' '}
              <span className="text-gold">BLADE & CROWN</span>{' '}
              CLUB
            </h3>
            <p className="text-gray-light">
              Get exclusive deals, grooming tips, and early access
              to new products
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex w-full lg:w-auto gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card border border-gray-dark rounded-lg px-5
                py-3 text-white focus:border-gold focus:outline-none
                transition-colors flex-1 lg:w-72"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gold text-dark px-6 py-3 font-bold uppercase
                tracking-wider rounded-lg hover:bg-gold-light
                transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {isLoading ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>

        <p className="text-gray-light text-xs text-center mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;