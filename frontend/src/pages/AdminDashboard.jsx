// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaCalendarAlt, FaShoppingBag, FaDollarSign,
  FaStar, FaCut, FaBoxes, FaChartLine, FaSignOutAlt,
  FaHome, FaUserShield, FaTrash, FaTimes, FaPlus, 
  FaImage, FaCheckCircle, FaUser
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  // Data States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal States
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    badge: '',
    image: null
  });

  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      fetchData();
    }
  }, [isAuthenticated, user, activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'overview') {
        const res = await API.get('/admin/stats/');
        setStats(res.data);
      } else if (activeSection === 'users') {
        const res = await API.get('/admin/users/');
        setUsers(res.data);
      } else if (activeSection === 'bookings') {
        const res = await API.get('/admin/bookings/');
        setBookings(res.data);
      } else if (activeSection === 'orders') {
        const res = await API.get('/admin/orders/');
        setOrders(res.data);
      } else if (activeSection === 'products') {
        const [prodRes, catRes] = await Promise.all([
          API.get('/admin/products/'),
          API.get('/admin/categories/')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } else if (activeSection === 'barbers') {
        const [barberRes, serviceRes] = await Promise.all([
          API.get('/services/barbers/'),
          API.get('/services/list/')
        ]);
        setBarbers(barberRes.data.results || barberRes.data || []);
        setServices(serviceRes.data.results || serviceRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  /* ----- Action Handlers ----- */
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await API.patch(`/admin/bookings/${bookingId}/update/`, { status: newStatus });
      toast.success('Booking status updated!');
      fetchData();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/admin/orders/${orderId}/update/`, { status: newStatus });
      toast.success('Order status updated!');
      fetchData();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}/delete/`);
      toast.success('User deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/products/${productId}/delete/`);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error('Name, Price, and Image are required!');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('description', newProduct.description);
    formData.append('badge', newProduct.badge);
    formData.append('image', newProduct.image);

    try {
      await API.post('/admin/products/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product created successfully!');
      setIsAddingProduct(false);
      setNewProduct({ name: '', category: '', price: '', stock: '', description: '', badge: '', image: null });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create product');
    }
    setIsSubmitting(false);
  };

  /* ----- Access Control Check ----- */
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.is_staff) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] rounded-2xl p-8 max-w-md text-center border border-error/30">
          <FaUserShield className="text-error text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-light text-sm mb-6">You need administrator privileges to view this page.</p>
          <Link to="/" className="bg-gold text-dark px-6 py-3 rounded-lg font-bold inline-block">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingBag /> },
    { id: 'products', label: 'Store & Products', icon: <FaBoxes /> },
    { id: 'barbers', label: 'Barbers & Services', icon: <FaCut /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'delivered': case 'confirmed': return 'bg-success/20 text-success border border-success/30';
      case 'pending': case 'processing': return 'bg-gold/20 text-gold border border-gold/30';
      case 'cancelled': case 'failed': return 'bg-error/20 text-error border border-error/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-gray-dark text-gray-light';
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-gray-dark fixed left-0 top-0 bottom-0 flex flex-col z-40">
        <div className="p-6 border-b border-gray-dark">
          <Link to="/" className="flex items-center gap-2">
            <FaCut className="text-gold text-2xl" />
            <div>
              <p className="text-white font-heading font-extrabold text-sm">BLADE & CROWN</p>
              <p className="text-gold text-xs">Admin Control Center</p>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-gray-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold text-dark flex items-center justify-center font-bold text-lg">
              {user?.first_name?.[0] || user?.username?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">{user?.first_name || user?.username}</p>
              <p className="text-gold text-xs">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id ? 'bg-gold text-dark font-bold' : 'text-gray-light hover:bg-[#1A1A1A] hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-dark space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-light hover:bg-[#1A1A1A] hover:text-white">
            <FaHome /> Main Website
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-error hover:bg-error/10">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content View Container */}
      <main className="flex-1 ml-64 p-8 relative">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-3xl font-heading font-extrabold text-white mb-8">Dashboard Overview</h1>
              {loading ? <LoadingSpinner /> : stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<FaDollarSign />} label="Total Revenue" value={`$${stats.revenue.total.toFixed(2)}`} color="success" />
                    <StatCard icon={<FaCalendarAlt />} label="Total Bookings" value={stats.overview.total_bookings} color="gold" />
                    <StatCard icon={<FaShoppingBag />} label="Total Orders" value={stats.overview.total_orders} color="blue" />
                    <StatCard icon={<FaUsers />} label="Total Users" value={stats.overview.total_users} color="purple" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <MiniStat icon={<FaCut />} label="Services" value={stats.overview.total_services} />
                    <MiniStat icon={<FaUserShield />} label="Barbers" value={stats.overview.total_barbers} />
                    <MiniStat icon={<FaBoxes />} label="Products" value={stats.overview.total_products} />
                    <MiniStat icon={<FaStar />} label="Avg Rating" value={`${stats.overview.avg_rating} ⭐`} />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeSection === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-3xl font-heading font-extrabold text-white mb-6">All Appointments ({bookings.length})</h1>
              {loading ? <LoadingSpinner /> : (
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-dark shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-light">
                      <thead className="bg-[#0A0A0A] border-b border-gray-dark uppercase text-xs font-bold text-gold">
                        <tr>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Service</th>
                          <th className="p-4">Barber</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length === 0 ? (
                          <tr><td colSpan="7" className="text-center py-10 text-gray-light">No appointment bookings found</td></tr>
                        ) : (
                          bookings.map((b) => (
                            <tr key={b.id} className="border-b border-gray-dark hover:bg-[#0A0A0A]">
                              <td className="p-4">
                                <p className="text-white font-bold">{b.customer_name}</p>
                                <p className="text-xs text-gray-light">{b.customer_email}</p>
                                <p className="text-xs text-gray-light">{b.customer_phone}</p>
                              </td>
                              <td className="p-4 text-white font-medium">{b.service_detail?.name || 'Haircut'}</td>
                              <td className="p-4 text-gold">{b.barber_detail?.name || 'Barber'}</td>
                              <td className="p-4 text-white">
                                {b.date}<br />
                                <span className="text-xs text-gold font-bold">{b.time?.substring(0, 5)}</span>
                              </td>
                              <td className="p-4 text-gold font-bold">${b.total_price}</td>
                              <td className="p-4">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${getStatusColor(b.status)}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                                  className="bg-[#0A0A0A] border border-gray-dark text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-gold outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: ORDERS */}
          {activeSection === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-3xl font-heading font-extrabold text-white mb-6">Customer Orders ({orders.length})</h1>
              {loading ? <LoadingSpinner /> : (
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-dark shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-light">
                      <thead className="bg-[#0A0A0A] border-b border-gray-dark uppercase text-xs font-bold text-gold">
                        <tr>
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Shipping Address</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr><td colSpan="6" className="text-center py-10 text-gray-light">No orders found</td></tr>
                        ) : (
                          orders.map((o) => (
                            <tr key={o.id} className="border-b border-gray-dark hover:bg-[#0A0A0A]">
                              <td className="p-4 font-mono text-gold font-bold">#{o.id}</td>
                              <td className="p-4">
                                <p className="text-white font-bold">{o.customer_name}</p>
                                <p className="text-xs text-gray-light">{o.customer_email}</p>
                              </td>
                              <td className="p-4 text-white text-xs max-w-xs truncate">{o.shipping_address || 'N/A'}</td>
                              <td className="p-4 text-gold font-bold">${o.total_amount}</td>
                              <td className="p-4">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${getStatusColor(o.status)}`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                  className="bg-[#0A0A0A] border border-gray-dark text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-gold outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: STORE & PRODUCTS */}
          {activeSection === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-heading font-extrabold text-white">Store & Products</h1>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-gold text-dark px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-gold-light transition-colors text-sm"
                >
                  <FaPlus /> Add New Product
                </button>
              </div>

              {loading ? <LoadingSpinner /> : (
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-dark shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-light">
                      <thead className="bg-[#0A0A0A] border-b border-gray-dark uppercase text-xs font-bold text-gold">
                        <tr>
                          <th className="p-4">Product</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4">Badge</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-b border-gray-dark hover:bg-[#0A0A0A]">
                            <td className="p-4 flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gold/20" />
                              <span className="text-white font-bold">{p.name}</span>
                            </td>
                            <td className="p-4 text-gray-light">{p.category_name || 'General'}</td>
                            <td className="p-4 text-gold font-bold">${p.price}</td>
                            <td className="p-4 text-white">{p.stock}</td>
                            <td className="p-4">
                              {p.badge && <span className="bg-gold/20 text-gold text-xs px-2.5 py-1 rounded-full uppercase font-bold">{p.badge}</span>}
                            </td>
                            <td className="p-4 text-center">
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-error hover:text-error/80 p-2"><FaTrash /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: BARBERS & SERVICES */}
          {activeSection === 'barbers' && (
            <motion.div key="barbers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-heading font-extrabold text-white mb-6">Barbers & Staff ({barbers.length})</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {barbers.map((b) => (
                    <div key={b.id} className="bg-[#1A1A1A] rounded-2xl p-5 border border-gray-dark text-center">
                      <img src={b.photo || 'https://randomuser.me/api/portraits/men/32.jpg'} alt={b.name} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gold object-cover" />
                      <h3 className="text-white font-bold text-lg">{b.name}</h3>
                      <p className="text-gold text-xs mb-2 font-medium">{b.specialty}</p>
                      <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-bold">⭐ {b.rating || '5.0'} Rating</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">Active Services ({services.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map((s) => (
                    <div key={s.id} className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-dark flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold">{s.icon || '✂️'} {s.name}</p>
                        <p className="text-gray-light text-xs">{s.duration} minutes</p>
                      </div>
                      <span className="text-gold font-bold text-lg">${s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: USERS */}
          {activeSection === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-3xl font-heading font-extrabold text-white mb-6">Registered Users ({users.length})</h1>
              {loading ? <LoadingSpinner /> : (
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-dark shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-light">
                      <thead className="bg-[#0A0A0A] border-b border-gray-dark uppercase text-xs font-bold text-gold">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Joined</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-gray-dark hover:bg-[#0A0A0A]">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gold text-dark flex items-center justify-center font-bold text-sm">
                                {u.first_name?.[0] || u.username?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="text-white font-bold">{u.first_name} {u.last_name}</p>
                                <p className="text-xs text-gray-light">@{u.username}</p>
                              </div>
                            </td>
                            <td className="p-4 text-white text-sm">{u.email}</td>
                            <td className="p-4 text-gray-light text-sm">{u.phone || '—'}</td>
                            <td className="p-4">
                              {u.is_staff ? (
                                <span className="bg-gold/20 text-gold border border-gold/30 text-xs px-2.5 py-1 rounded-full font-bold uppercase">ADMIN</span>
                              ) : (
                                <span className="bg-gray-dark text-gray-light text-xs px-2.5 py-1 rounded-full font-bold uppercase">CUSTOMER</span>
                              )}
                            </td>
                            <td className="p-4 text-gray-light text-xs">{new Date(u.date_joined).toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                              {!u.is_staff && (
                                <button onClick={() => handleDeleteUser(u.id)} className="text-error hover:text-error/80 p-2"><FaTrash /></button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#1A1A1A] rounded-2xl border border-gold/30 max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsAddingProduct(false)} className="absolute top-4 right-4 text-gray-light hover:text-gold text-xl"><FaTimes /></button>
              <h2 className="text-xl font-heading font-extrabold text-white mb-6">Add Store Product</h2>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="border-2 border-dashed border-gray-dark rounded-xl p-6 text-center hover:border-gold transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.files[0]})}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  {newProduct.image ? (
                    <p className="text-gold font-bold flex items-center justify-center gap-2"><FaCheckCircle/> {newProduct.image.name}</p>
                  ) : (
                    <div className="text-gray-light">
                      <FaImage className="text-3xl mx-auto mb-2 text-gold/50" />
                      <p className="text-sm font-medium text-white">Click or drag image to upload</p>
                      <p className="text-xs text-gray-light mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-light uppercase font-bold mb-1 block">Product Name</label>
                    <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg p-2.5 text-white focus:border-gold outline-none text-sm" placeholder="e.g. Pomade" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-light uppercase font-bold mb-1 block">Category</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg p-2.5 text-white focus:border-gold outline-none text-sm">
                      <option value="">Select Category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-light uppercase font-bold mb-1 block">Price ($)</label>
                    <input type="number" step="0.01" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg p-2.5 text-white focus:border-gold outline-none text-sm" placeholder="24.99" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-light uppercase font-bold mb-1 block">Stock Quantity</label>
                    <input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg p-2.5 text-white focus:border-gold outline-none text-sm" placeholder="50" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-light uppercase font-bold mb-1 block">Badge (Optional)</label>
                  <select value={newProduct.badge} onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})} className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg p-2.5 text-white focus:border-gold outline-none text-sm">
                    <option value="">None</option>
                    <option value="bestseller">Bestseller</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-light uppercase font-bold mb-1 block">Description</label>
                  <textarea rows="3" required value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#0A0A0A] border border-gray-dark rounded-lg p-2.5 text-white focus:border-gold outline-none text-sm resize-none" placeholder="Product details..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-dark py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50 text-sm">
                  {isSubmitting ? 'Saving Product...' : 'Save Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ----- Helper Component Helpers ----- */
const LoadingSpinner = () => (
  <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>
);

const StatCard = ({ icon, label, value, color = 'gold' }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-dark">
      <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-gold/20 flex items-center justify-center text-gold text-xl mb-4">
        {icon}
      </div>
      <p className="text-gray-light text-xs uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-extrabold">{value}</p>
    </div>
  );
};

const MiniStat = ({ icon, label, value }) => (
  <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-dark flex items-center gap-3">
    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">{icon}</div>
    <div>
      <p className="text-gray-light text-xs">{label}</p>
      <p className="text-white font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;