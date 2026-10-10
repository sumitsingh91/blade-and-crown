// frontend/src/components/Store.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const defaultProducts = [
  {
    id: 1, name: 'Premium Hair Pomade', brand: 'BLADE & CROWN',
    price: 24.99, old_price: null, rating: 4.8, review_count: 128,
    badge: 'bestseller', image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400',
    category_name: 'Styling',
  },
  {
    id: 2, name: 'Beard Oil - Sandalwood', brand: 'BLADE & CROWN',
    price: 18.99, old_price: null, rating: 4.9, review_count: 96,
    badge: '', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    category_name: 'Beard Care',
  },
  {
    id: 3, name: 'Styling Clay - Matte', brand: 'BLADE & CROWN',
    price: 22.99, old_price: null, rating: 4.7, review_count: 84,
    badge: '', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    category_name: 'Styling',
  },
  {
    id: 4, name: 'Barber Comb Set', brand: 'BLADE & CROWN',
    price: 12.99, old_price: null, rating: 4.6, review_count: 62,
    badge: '', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400',
    category_name: 'Accessories',
  },
  {
    id: 5, name: 'After Shave Balm', brand: 'BLADE & CROWN',
    price: 16.99, old_price: 22.99, rating: 4.8, review_count: 110,
    badge: 'sale', image: 'https://images.unsplash.com/photo-1594898515797-56a1e6f58e56?w=400',
    category_name: 'Skincare',
  },
  {
    id: 6, name: 'Hair Growth Serum', brand: 'BLADE & CROWN',
    price: 29.99, old_price: null, rating: 4.5, review_count: 45,
    badge: 'new', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    category_name: 'Hair Care',
  },
  {
    id: 7, name: 'Beard Brush - Boar', brand: 'BLADE & CROWN',
    price: 14.99, old_price: null, rating: 4.8, review_count: 73,
    badge: '', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400',
    category_name: 'Beard Care',
  },
  {
    id: 8, name: 'Sea Salt Texture Spray', brand: 'BLADE & CROWN',
    price: 19.99, old_price: null, rating: 4.7, review_count: 58,
    badge: '', image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400',
    category_name: 'Styling',
  },
];

const categories = [
  'All', 'Hair Care', 'Beard Care', 'Styling', 'Skincare', 'Accessories'
];

const Store = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    API.get('/store/products/')
      .then((res) => {
        if (res.data.results?.length > 0) {
          setProducts(res.data.results);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category_name === activeCategory);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'bestseller': return 'bg-gold text-dark';
      case 'new': return 'bg-success text-white';
      case 'sale': return 'bg-error text-white';
      default: return '';
    }
  };

  return (
    <section id="store" className="py-20 lg:py-28 bg-dark">
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
            THE GROOMING{' '}
            <span className="text-gold">STORE</span>
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-4" />
          <p className="text-gray-light text-lg">
            Premium products handpicked by our expert barbers
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8
          scrollbar-hide justify-start lg:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg text-sm font-medium
                whitespace-nowrap transition-all duration-300
                ${activeCategory === cat
                  ? 'bg-gold text-dark'
                  : 'bg-card text-gray-light hover:text-white hover:bg-gray-dark'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
          md:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-card rounded-lg overflow-hidden group
                hover:shadow-lg hover:shadow-gold/10 transition-all
                duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover
                    group-hover:scale-110 transition-transform
                    duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-2 py-1
                    text-xs font-bold uppercase rounded
                    ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </span>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full
                    bg-dark/50 flex items-center justify-center
                    hover:bg-dark/80 transition-colors"
                >
                  {wishlist.includes(product.id) ? (
                    <FaHeart className="text-error text-sm" />
                  ) : (
                    <FaRegHeart className="text-white text-sm" />
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-gray-light text-xs uppercase tracking-wider
                  mb-1">
                  {product.brand}
                </p>
                <h3 className="text-white font-bold text-sm mb-2
                  line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(product.rating)
                          ? 'text-gold'
                          : 'text-gray-dark'
                      }`}
                    />
                  ))}
                  <span className="text-gray-light text-xs ml-1">
                    ({product.review_count})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gold font-bold text-lg">
                    ${product.price}
                  </span>
                  {product.old_price && (
                    <span className="text-gray-light text-sm line-through">
                      ${product.old_price}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full border border-gold text-gold py-2
                    rounded-lg text-sm font-medium flex items-center
                    justify-center gap-2 hover:bg-gold hover:text-dark
                    transition-all duration-300"
                >
                  <FaShoppingCart className="text-xs" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <button className="text-gold font-medium hover:underline
            text-lg">
            View All Products →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Store;