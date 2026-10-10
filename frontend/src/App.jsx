// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Booking from './components/Booking';
import AIAdvisor from './components/AIAdvisor';
import Store from './components/Store';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

import Login from './pages/Login';
import Signup from './pages/Signup';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <Services />
    <Stats />
    <Booking />
    <AIAdvisor />
    <Store />
    <Gallery />
    <Testimonials />
    <Contact />
    <Newsletter />
    <Footer />
  </>
);

function App() {
  return (
    <div className="bg-dark min-h-screen text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #D4AF37',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/profile" element={<Profile />} /> {/* 👈 Add this line */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;