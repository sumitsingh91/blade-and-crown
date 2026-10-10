// frontend/src/components/Services.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import API from '../api/axios';

const defaultServices = [
  {
    id: 1, icon: '✂️', name: 'Classic Haircut',
    description: 'Precision cut tailored to your style and face shape',
    duration: 30, price: '25.00'
  },
  {
    id: 2, icon: '🧔', name: 'Beard Grooming',
    description: 'Shape, trim & condition your beard to perfection',
    duration: 20, price: '15.00'
  },
  {
    id: 3, icon: '🪒', name: 'Hot Towel Shave',
    description: 'Traditional straight razor luxury shave experience',
    duration: 25, price: '30.00'
  },
  {
    id: 4, icon: '💇', name: 'Hair + Beard Combo',
    description: 'Complete grooming package for the full transformation',
    duration: 45, price: '35.00'
  },
  {
    id: 5, icon: '🧒', name: 'Kids Haircut',
    description: 'Fun & friendly haircuts for young gentlemen',
    duration: 20, price: '18.00'
  },
  {
    id: 6, icon: '🎨', name: 'Hair Coloring',
    description: 'Bold or subtle color transformations by experts',
    duration: 60, price: '45.00'
  },
];

const Services = () => {
  const [services, setServices] = useState(defaultServices);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    API.get('/services/list/')
      .then((res) => {
        if (res.data.results?.length > 0) {
          setServices(res.data.results);
        }
      })
      .catch(() => {
        // Use default services
      });
  }, []);

  return (
    <section id="services" className="py-20 lg:py-28 bg-dark relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg, transparent, transparent 35px,
              rgba(212,175,55,0.1) 35px, rgba(212,175,55,0.1) 36px
            )`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            OUR{' '}
            <span className="text-gold">SERVICES</span>
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-4" />
          <p className="text-gray-light text-lg max-w-2xl mx-auto">
            Crafted for the modern gentleman. Every service delivered
            with precision and care.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border-l-4 border-gold rounded-lg p-6
                hover:shadow-lg hover:shadow-gold/10 transition-all
                duration-300 hover:scale-[1.02] group cursor-pointer"
            >
              <span className="text-4xl mb-4 block">{service.icon}</span>
              <h3 className="text-xl font-heading font-bold text-white mb-2
                group-hover:text-gold transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-light text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-light">
                    🕐 {service.duration} min
                  </span>
                  <span className="text-gold font-bold text-lg">
                    ${service.price}
                  </span>
                </div>
                <a
                  href="#booking"
                  className="text-gold text-sm font-medium hover:underline
                    flex items-center gap-1"
                >
                  Book Now →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;