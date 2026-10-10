// frontend/src/components/Contact.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaInstagram, FaFacebook, FaTiktok, FaYoutube
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: 'General', message: ''
  });
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    setFormData({
      name: '', email: '', phone: '', subject: 'General', message: ''
    });
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      label: 'Address',
      value: '123 Main Street, Downtown, New York, NY 10001'
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: '(555) 123-4567'
    },
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'hello@bladeandcrown.com'
    },
  ];

  const hours = [
    { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 9:00 PM' },
    { day: 'Sunday', time: '10:00 AM - 5:00 PM' },
  ];

  const socialLinks = [
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaTiktok />, href: '#', label: 'TikTok' },
    { icon: <FaYoutube />, href: '#', label: 'YouTube' },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-card">
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
            FIND{' '}
            <span className="text-gold">US</span>
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-heading font-bold text-white mb-6">
              Get in Touch
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-dark border border-gray-dark rounded-lg
                    px-4 py-3 text-white focus:border-gold
                    focus:outline-none transition-colors w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-dark border border-gray-dark rounded-lg
                    px-4 py-3 text-white focus:border-gold
                    focus:outline-none transition-colors w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-dark border border-gray-dark rounded-lg
                    px-4 py-3 text-white focus:border-gold
                    focus:outline-none transition-colors w-full"
                />
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="bg-dark border border-gray-dark rounded-lg
                    px-4 py-3 text-white focus:border-gold
                    focus:outline-none transition-colors w-full"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Careers">Careers</option>
                </select>
              </div>
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="bg-dark border border-gray-dark rounded-lg
                  px-4 py-3 text-white focus:border-gold
                  focus:outline-none transition-colors w-full resize-none"
                required
              />
              <button
                type="submit"
                className="bg-gold text-dark px-8 py-3 font-bold uppercase
                  tracking-wider rounded-lg hover:bg-gold-light
                  transition-colors w-full sm:w-auto"
              >
                Send Message
              </button>

              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-gold
                      text-gold flex items-center justify-center
                      hover:bg-gold hover:text-dark transition-all
                      duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </form>
          </div>

          {/* Map & Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="rounded-lg overflow-hidden h-64 bg-gray-dark">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzAwLjAiTiA3M8KwNTgnNDguMCJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                title="Map"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <span className="text-gold text-xl mt-1">{info.icon}</span>
                  <div>
                    <p className="text-gray-light text-sm">{info.label}</p>
                    <p className="text-white font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="bg-dark rounded-lg p-6">
              <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                <FaClock className="text-gold" />
                Business Hours
              </h4>
              <div className="space-y-2">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-gray-light">{h.day}</span>
                    <span className="text-white font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-success text-sm font-medium">
                  Open Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;