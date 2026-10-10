// frontend/src/components/Testimonials.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import API from '../api/axios';

const defaultReviews = [
  {
    id: 1, customer_name: 'Marcus Johnson',
    customer_photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5, badge: 'Regular Client',
    review_text: 'Best barbershop experience I\'ve ever had. The AI style advisor helped me find a look I never would have tried. Absolutely love the result!',
    visit_date: '2025-01-15',
  },
  {
    id: 2, customer_name: 'David Roberts',
    customer_photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5, badge: 'Regular Client',
    review_text: 'Clean shop, skilled barbers, and the online booking makes it so convenient. My go-to spot every 2 weeks without fail.',
    visit_date: '2025-01-10',
  },
  {
    id: 3, customer_name: 'James Kim',
    customer_photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5, badge: 'First Visit',
    review_text: 'The hot towel shave was incredible. Felt like a luxury spa treatment. Will definitely be back for more!',
    visit_date: '2025-01-08',
  },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState({
    average_rating: 4.9,
    total_reviews: 2847,
    rating_breakdown: {
      '5_star': { percentage: 89 },
      '4_star': { percentage: 7 },
      '3_star': { percentage: 2 },
      '2_star': { percentage: 1 },
      '1_star': { percentage: 1 },
    },
  });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    API.get('/reviews/list/').then((res) => {
      if (res.data.results?.length > 0) setReviews(res.data.results);
    }).catch(() => {});

    API.get('/reviews/summary/').then((res) => {
      setSummary(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-20 lg:py-28 bg-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold
            text-white mb-4">
            WHAT OUR CLIENTS{' '}
            <span className="text-gold">SAY</span>
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="bg-card rounded-xl p-8 border border-gold/20">
            <div className="text-center mb-6">
              <span className="text-6xl font-heading font-extrabold text-gold">
                {summary.average_rating}
              </span>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-gold text-xl" />
                ))}
              </div>
              <p className="text-gray-light text-sm mt-2">
                Based on {summary.total_reviews.toLocaleString()} reviews
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {Object.entries(summary.rating_breakdown).map(
                ([key, value]) => {
                  const stars = key.charAt(0);
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-white text-sm w-8">
                        {stars}★
                      </span>
                      <div className="flex-1 bg-gray-dark rounded-full h-2">
                        <div
                          className="bg-gold h-2 rounded-full transition-all
                            duration-1000"
                          style={{ width: `${value.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-light text-xs w-10
                        text-right">
                        {value.percentage}%
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="lg:col-span-2 relative">
            <div className="bg-card rounded-xl p-8 md:p-10 border
              border-gold/10 min-h-[300px] flex flex-col justify-between">
              <FaQuoteLeft className="text-gold/30 text-4xl mb-4" />

              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-white text-lg md:text-xl italic
                  font-accent leading-relaxed mb-6">
                  "{reviews[currentIndex]?.review_text}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={reviews[currentIndex]?.customer_photo}
                    alt={reviews[currentIndex]?.customer_name}
                    className="w-14 h-14 rounded-full border-2
                      border-gold object-cover"
                  />
                  <div>
                    <p className="text-white font-bold">
                      {reviews[currentIndex]?.customer_name}
                    </p>
                    <span className="text-gold text-xs font-medium
                      bg-gold/20 px-2 py-0.5 rounded-full">
                      {reviews[currentIndex]?.badge}
                    </span>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(reviews[currentIndex]?.rating || 5)].map(
                      (_, i) => (
                        <FaStar key={i} className="text-gold text-sm" />
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all
                        ${i === currentIndex ? 'bg-gold w-6' : 'bg-gray-dark'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevReview}
                    className="w-10 h-10 rounded-full border border-gold
                      text-gold flex items-center justify-center
                      hover:bg-gold hover:text-dark transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextReview}
                    className="w-10 h-10 rounded-full border border-gold
                      text-gold flex items-center justify-center
                      hover:bg-gold hover:text-dark transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;