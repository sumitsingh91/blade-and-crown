// frontend/src/components/Gallery.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEye, FaTimes } from 'react-icons/fa';
import API from '../api/axios';

const defaultImages = [
  {
    id: 1, title: 'Classic Fade', category: 'fades',
    barber_name: 'Marcus', style_name: 'Low Fade',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600'
  },
  {
    id: 2, title: 'Beard Styling', category: 'beards',
    barber_name: 'David', style_name: 'Full Beard Trim',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600'
  },
  {
    id: 3, title: 'Textured Crop', category: 'creative',
    barber_name: 'Carlos', style_name: 'Textured Top',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600'
  },
  {
    id: 4, title: 'Side Part Classic', category: 'classic',
    barber_name: 'James', style_name: 'Side Part',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600'
  },
  {
    id: 5, title: 'Skin Fade', category: 'fades',
    barber_name: 'Marcus', style_name: 'Skin Fade',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600'
  },
  {
    id: 6, title: 'Full Transformation', category: 'transformations',
    barber_name: 'Carlos', style_name: 'Before & After',
    image: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600'
  },
];

const filterCategories = [
  'All', 'Fades', 'Beards', 'Classic', 'Creative', 'Transformations'
];

const Gallery = () => {
  const [images, setImages] = useState(defaultImages);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    API.get('/gallery/images/')
      .then((res) => {
        if (res.data.results?.length > 0) {
          setImages(res.data.results);
        }
      })
      .catch(() => {});
  }, []);

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter((img) =>
        img.category.toLowerCase() === activeFilter.toLowerCase()
      );

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold
            text-white mb-4">
            OUR{' '}
            <span className="text-gold">WORK</span>
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-4" />
          <p className="text-gray-light text-lg">
            Craftsmanship and artistry in every cut
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8
          scrollbar-hide justify-start lg:justify-center">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-lg text-sm font-medium
                whitespace-nowrap transition-all duration-300
                ${activeFilter === cat
                  ? 'bg-gold text-dark'
                  : 'bg-dark text-gray-light hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid relative group cursor-pointer
                rounded-lg overflow-hidden"
              onClick={() => setLightbox(image)}
            >
              <img
                src={image.image}
                alt={image.title}
                className="w-full rounded-lg group-hover:scale-105
                  transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60
                transition-all duration-300 rounded-lg flex flex-col
                items-center justify-center opacity-0 group-hover:opacity-100">
                <FaEye className="text-gold text-2xl mb-2" />
                <p className="text-white font-bold">{image.style_name}</p>
                <p className="text-gold text-sm">by {image.barber_name}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram Section */}
        <div className="text-center mt-12">
          <p className="text-gray-light mb-2">Follow us on Instagram</p>
          <a
            href="https://instagram.com/bladeandcrown"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold font-bold text-lg hover:underline"
          >
            @bladeandcrown →
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-dark/95 flex items-center
            justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white text-2xl
            hover:text-gold transition-colors">
            <FaTimes />
          </button>
          <img
            src={lightbox.image}
            alt={lightbox.title}
            className="max-w-full max-h-[80vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;