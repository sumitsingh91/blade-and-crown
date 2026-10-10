// frontend/src/components/Footer.jsx
import { useState, useEffect } from 'react';
import { FaCut, FaInstagram, FaFacebook, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import { IoChevronUp } from 'react-icons/io5';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'AI Style Advisor', href: '#ai-advisor' },
    { name: 'Book Appointment', href: '#booking' },
    { name: 'Store', href: '#store' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const serviceLinks = [
    'Classic Haircut', 'Beard Grooming', 'Hot Towel Shave',
    'Hair + Beard Combo', 'Kids Haircut', 'Hair Coloring'
  ];

  const socialLinks = [
    { icon: <FaInstagram />, href: '#' },
    { icon: <FaFacebook />, href: '#' },
    { icon: <FaTiktok />, href: '#' },
    { icon: <FaYoutube />, href: '#' },
    { icon: <FaTwitter />, href: '#' },
  ];

  return (
    <>
      <footer className="bg-dark pt-16 pb-8 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <a href="#home" className="flex items-center gap-2 mb-4">
                <FaCut className="text-gold text-xl" />
                <span className="text-xl font-heading font-extrabold text-white">
                  BLADE <span className="text-gold">&</span> CROWN
                </span>
              </a>
              <p className="text-gray-light text-sm mb-4 leading-relaxed">
                Premium barbershop delivering exceptional grooming experiences since 2020. Where every cut is crafted with precision.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="text-gold hover:text-gold-light transition-colors text-lg hover:scale-110 transform duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gold text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-light text-sm hover:text-gold transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-gold text-sm font-bold uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2">
                {serviceLinks.map((service) => (
                  <li key={service}>
                    <a href="#services" className="text-gray-light text-sm hover:text-gold transition-colors">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-gold text-sm font-bold uppercase tracking-wider mb-4">Visit Us</h4>
              <div className="space-y-3 text-sm">
                <p className="text-gray-light">📍 123 Main Street, Downtown, NY 10001</p>
                <p className="text-gray-light">📞 (555) 123-4567</p>
                <p className="text-gray-light">📧 hello@bladeandcrown.com</p>
                <p className="text-gray-light">🕐 Mon-Sat: 9AM-8PM<br />&nbsp;&nbsp;&nbsp;&nbsp; Sun: 10AM-5PM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gold/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-light text-xs">
              © 2026 Blade & Crown Barbershop. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-gray-light hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-light hover:text-gold transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-light hover:text-gold transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gold text-dark flex items-center justify-center shadow-lg shadow-gold/30 hover:bg-gold-light transition-all duration-300 hover:scale-110"
        >
          <IoChevronUp className="text-xl" />
        </button>
      )}
    </>
  );
};

export default Footer;