// frontend/src/components/Hero.jsx
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaStar, FaUsers } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1585747860019-8623f53a1504?w=1920')`,
        }}
      >
        <div className="absolute inset-0  from-dark via-dark/80 to-dark/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold font-medium tracking-[0.3em] uppercase mb-4
              text-sm"
          >
            Welcome to Blade & Crown
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-heading font-extrabold
              text-white leading-tight mb-6"
          >
            WHERE STYLE
            <br />
            MEETS{' '}
            <span className="text-gold relative">
              PRECISION
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gold" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-light text-lg md:text-xl mb-8 max-w-xl"
          >
            Premium grooming experience since 2020. Where every cut is
            crafted with precision and every client leaves feeling
            like a king.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#booking"
              className="bg-gold text-dark px-8 py-4 font-bold uppercase
                tracking-wider rounded flex items-center justify-center
                gap-2 hover:bg-gold-light transition-all duration-300
                hover:shadow-lg hover:shadow-gold/30"
            >
              <FaCalendarAlt />
              Book Appointment
            </a>
            <a
              href="#ai-advisor"
              className="border-2 border-gold text-gold px-8 py-4 font-bold
                uppercase tracking-wider rounded flex items-center
                justify-center gap-2 hover:bg-gold hover:text-dark
                transition-all duration-300"
            >
              <HiSparkles />
              Try AI Style Advisor
            </a>
          </motion.div>
        </div>

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="hidden lg:flex flex-col gap-4 absolute right-8 top-1/2
            -translate-y-1/2"
        >
          {[
            { icon: <FaStar />, text: '4.9 Rating', sub: 'Google Reviews' },
            { icon: <FaUsers />, text: '5000+', sub: 'Happy Clients' },
            { icon: <FaStar />, text: '10+', sub: 'Expert Barbers' },
          ].map((badge, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md border border-white/20
                rounded-xl px-5 py-3 flex items-center gap-3"
            >
              <span className="text-gold text-xl">{badge.icon}</span>
              <div>
                <p className="text-white font-bold text-lg">{badge.text}</p>
                <p className="text-gray-light text-xs">{badge.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Down Arrow */}
      <motion.a
        href="#services"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold
          text-3xl cursor-pointer"
      >
        <IoChevronDown />
      </motion.a>
    </section>
  );
};

export default Hero;