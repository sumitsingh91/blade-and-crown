// frontend/src/components/Stats.jsx
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaCut, FaClock, FaStar } from 'react-icons/fa';

// Custom Animated Counter
const Counter = ({ end, duration = 2, decimals = 0, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(progress * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const stats = [
  { icon: <FaUsers />, end: 5000, suffix: '+', label: 'Happy Clients' },
  { icon: <FaCut />, end: 10, suffix: '+', label: 'Expert Barbers' },
  { icon: <FaClock />, end: 8, suffix: '+', label: 'Years Experience' },
  { icon: <FaStar />, end: 4.9, decimals: 1, suffix: '', label: 'Average Rating' },
];

const Stats = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-16 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-gold to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-gold text-3xl mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-heading font-extrabold text-gold mb-2">
                {inView ? (
                  <Counter
                    end={stat.end}
                    duration={2}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <p className="text-gray-light text-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-gold to-transparent" />
    </section>
  );
};

export default Stats;