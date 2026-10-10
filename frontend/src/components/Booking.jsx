// frontend/src/components/Booking.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import toast from 'react-hot-toast';

const defaultBarbers = [
  {
    id: 1,
    name: 'Marcus Johnson',
    specialty: 'Fade Specialist',
    rating: '4.9',
    years_experience: 8,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    is_available: true,
  },
  {
    id: 2,
    name: 'David Chen',
    specialty: 'Beard Expert',
    rating: '4.8',
    years_experience: 6,
    photo: 'https://randomuser.me/api/portraits/men/44.jpg',
    is_available: true,
  },
  {
    id: 3,
    name: 'James Wilson',
    specialty: 'Classic Cuts',
    rating: '4.9',
    years_experience: 10,
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    is_available: true,
  },
  {
    id: 4,
    name: 'Carlos Rivera',
    specialty: 'Creative Stylist',
    rating: '4.7',
    years_experience: 5,
    photo: 'https://randomuser.me/api/portraits/men/62.jpg',
    is_available: true,
  },
];

const defaultServices = [
  { id: 1, icon: '✂️', name: 'Classic Haircut', duration: 30, price: '25.00' },
  { id: 2, icon: '🧔', name: 'Beard Grooming', duration: 20, price: '15.00' },
  { id: 3, icon: '🪒', name: 'Hot Towel Shave', duration: 25, price: '30.00' },
  { id: 4, icon: '💇', name: 'Hair + Beard Combo', duration: 45, price: '35.00' },
  { id: 5, icon: '🧒', name: 'Kids Haircut', duration: 20, price: '18.00' },
  { id: 6, icon: '🎨', name: 'Hair Coloring', duration: 60, price: '45.00' },
];

const timeSlots = [
  {
    label: 'Morning',
    times: [
      { display: '9:00 AM', value: '09:00:00' },
      { display: '9:30 AM', value: '09:30:00' },
      { display: '10:00 AM', value: '10:00:00' },
      { display: '10:30 AM', value: '10:30:00' },
      { display: '11:00 AM', value: '11:00:00' },
      { display: '11:30 AM', value: '11:30:00' },
    ],
  },
  {
    label: 'Afternoon',
    times: [
      { display: '12:00 PM', value: '12:00:00' },
      { display: '12:30 PM', value: '12:30:00' },
      { display: '1:00 PM', value: '13:00:00' },
      { display: '1:30 PM', value: '13:30:00' },
      { display: '2:00 PM', value: '14:00:00' },
      { display: '3:00 PM', value: '15:00:00' },
    ],
  },
  {
    label: 'Evening',
    times: [
      { display: '5:00 PM', value: '17:00:00' },
      { display: '5:30 PM', value: '17:30:00' },
      { display: '6:00 PM', value: '18:00:00' },
      { display: '6:30 PM', value: '18:30:00' },
      { display: '7:00 PM', value: '19:00:00' },
    ],
  },
];

const Booking = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState(defaultServices);
  const [barbers, setBarbers] = useState(defaultBarbers);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    API.get('/services/list/')
      .then((res) => {
        if (res.data.results?.length) setServices(res.data.results);
        else if (Array.isArray(res.data) && res.data.length) setServices(res.data);
      })
      .catch(() => {});

    API.get('/services/barbers/')
      .then((res) => {
        if (res.data.results?.length) setBarbers(res.data.results);
        else if (Array.isArray(res.data) && res.data.length) setBarbers(res.data);
      })
      .catch(() => {});
  }, []);

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      toast.error('Please complete all booking steps');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in your name, email, and phone number');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      service: selectedService.id,
      barber: selectedBarber.id,
      date: selectedDate,
      time: selectedTime,
      customer_name: formData.name.trim(),
      customer_email: formData.email.trim(),
      customer_phone: formData.phone.trim(),
      notes: formData.notes?.trim() || '',
    };

    try {
      await API.post('/bookings/list/', payload);
      toast.success('Booking confirmed! Check your email.');

      // Reset
      setStep(1);
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedDate('');
      setSelectedTime('');
      setFormData({ name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      const errData = error.response?.data;
      let message = 'Booking failed. Please try again.';

      if (errData) {
        if (typeof errData === 'string') {
          message = errData;
        } else if (errData.detail) {
          message = errData.detail;
        } else {
          const firstKey = Object.keys(errData)[0];
          const firstError = Array.isArray(errData[firstKey])
            ? errData[firstKey][0]
            : errData[firstKey];
          message = `${firstKey}: ${firstError}`;
        }
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 lg:py-28 bg-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            BOOK YOUR <span className="text-gold">APPOINTMENT</span>
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mb-4" />
          <p className="text-gray-light text-lg">
            Quick & easy online booking in 4 simple steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s
                    ? 'bg-gold text-dark'
                    : 'bg-gray-dark text-gray-light'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 sm:w-24  transition-all duration-300 ${
                    step > s ? 'bg-gold' : 'bg-gray-dark'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-heading font-bold text-white text-center mb-8">
                Select a Service
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`bg-card rounded-lg p-5 cursor-pointer transition-all duration-300 border-2 ${
                      selectedService?.id === service.id
                        ? 'border-gold shadow-lg shadow-gold/20'
                        : 'border-transparent hover:border-gold/30'
                    }`}
                  >
                    <span className="text-3xl">{service.icon || '✂️'}</span>
                    <h4 className="text-lg font-bold text-white mt-2">
                      {service.name}
                    </h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-light text-sm">
                        🕐 {service.duration} min
                      </span>
                      <span className="text-gold font-bold">
                        ${service.price}
                      </span>
                    </div>
                    {selectedService?.id === service.id && (
                      <div className="mt-2 text-gold text-sm font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => selectedService && setStep(2)}
                  disabled={!selectedService}
                  className="bg-gold text-dark px-8 py-3 font-bold uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Barber */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-heading font-bold text-white text-center mb-8">
                Choose Your Barber
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber)}
                    className={`bg-card rounded-lg p-5 cursor-pointer text-center transition-all duration-300 border-2 ${
                      selectedBarber?.id === barber.id
                        ? 'border-gold shadow-lg shadow-gold/20 scale-105'
                        : 'border-transparent hover:border-gold/30'
                    }`}
                  >
                    <img
                      src={barber.photo || 'https://randomuser.me/api/portraits/men/32.jpg'}
                      alt={barber.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gold object-cover"
                    />
                    <h4 className="text-lg font-bold text-white">
                      {barber.name}
                    </h4>
                    <p className="text-gold text-sm">{barber.specialty}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <span className="text-gold">⭐</span>
                      <span className="text-white text-sm font-medium">
                        {barber.rating || '5.0'}
                      </span>
                    </div>
                    <p className="text-gray-light text-xs mt-1">
                      {barber.years_experience} years exp.
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-gold text-gold px-8 py-3 font-bold uppercase tracking-wider rounded hover:bg-gold hover:text-dark transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => selectedBarber && setStep(3)}
                  disabled={!selectedBarber}
                  className="bg-gold text-dark px-8 py-3 font-bold uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Pick Date & Time */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-heading font-bold text-white text-center mb-8">
                Pick Date & Time
              </h3>

              <div>
                <label className="text-white font-medium mb-3 block">
                  Select Date
                </label>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {getDates().map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                    const dayNum = date.getDate();
                    const month = date.toLocaleDateString('en', { month: 'short' });

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={` w-20 py-3 rounded-lg text-center transition-all duration-300 border ${
                          selectedDate === dateStr
                            ? 'bg-gold text-dark border-gold'
                            : 'bg-card text-white border-gray-dark hover:border-gold/50'
                        }`}
                      >
                        <p className="text-xs uppercase">{dayName}</p>
                        <p className="text-xl font-bold">{dayNum}</p>
                        <p className="text-xs">{month}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  {timeSlots.map((group) => (
                    <div key={group.label}>
                      <label className="text-gray-light text-sm font-medium mb-2 block">
                        {group.label}
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {group.times.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => setSelectedTime(slot.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              selectedTime === slot.value
                                ? 'bg-gold text-dark'
                                : 'bg-card text-white hover:border-gold border border-gray-dark'
                            }`}
                          >
                            {slot.display}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-gold text-gold px-8 py-3 font-bold uppercase tracking-wider rounded hover:bg-gold hover:text-dark transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => selectedDate && selectedTime && setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className="bg-gold text-dark px-8 py-3 font-bold uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Customer Details */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-heading font-bold text-white text-center mb-8">
                Your Details
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-1 block">
                      👤 Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-card border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-1 block">
                      📞 Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-card border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-1 block">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-card border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-1 block">
                      📝 Special Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full bg-card border border-gray-dark rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>

                <div className="bg-card border border-gold/30 rounded-lg p-6">
                  <h4 className="text-lg font-heading font-bold text-gold mb-4">
                    📋 Booking Summary
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-light">Service:</span>
                      <span className="text-white font-medium">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Barber:</span>
                      <span className="text-white font-medium">
                        {selectedBarber?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Date:</span>
                      <span className="text-white font-medium">
                        {selectedDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Time:</span>
                      <span className="text-white font-medium">
                        {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-light">Duration:</span>
                      <span className="text-white font-medium">
                        {selectedService?.duration} min
                      </span>
                    </div>
                    <hr className="border-gray-dark" />
                    <div className="flex justify-between text-lg">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-gold font-extrabold">
                        ${selectedService?.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="border border-gold text-gold px-8 py-3 font-bold uppercase tracking-wider rounded hover:bg-gold hover:text-dark transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !formData.name ||
                    !formData.email ||
                    !formData.phone ||
                    isSubmitting
                  }
                  className="bg-gold text-dark px-8 py-3 font-bold uppercase tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking ✓'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// 🔴 THIS LINE IS CRITICAL - FIXES THE EXPORT ERROR
export default Booking;