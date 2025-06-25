import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const About = () => {
  const { login, register } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
        alert('Logged in successfully!');
      } else {
        await register(email, password, fullName);
        alert('Account created successfully!');
      }
      navigate('/home');
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side: Services Section */}
      <div className="flex-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 p-8 md:p-16">
        <img src='/assets/mediLogi1.png' alt='logo'/>
        <h2 className="text-4xl font-bold text-center text-white mb-6">What Services We Provide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Service Item 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4 bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src="/assets/service-icon1.jpg"
              alt="Personalized Health Records"
              className="h-12 w-12"
            />
            <p className="text-lg font-medium">Personalized Health Records</p>
          </motion.div>

          {/* Service Item 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-4 bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src="/assets/service-icon22.png"
              alt="Appointment Scheduling"
              className="h-12 w-12"
            />
            <p className="text-lg font-medium">Appointment Scheduling</p>
          </motion.div>

          {/* Service Item 3 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4 bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src="/assets/service-icon3.jpg"
              alt="Real-Time Health Monitoring"
              className="h-12 w-12"
            />
            <p className="text-lg font-medium">Real-Time Health Monitoring</p>
          </motion.div>

          {/* Service Item 4 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center space-x-4 bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src="/assets/service-icon4.png"
              alt="24/7 Consultation Services"
              className="h-12 w-12"
            />
            <p className="text-lg font-medium">24/7 Consultation Services</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login / Signup Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-7 text-center">{isLogin ? 'Log In' : 'Sign Up'}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <>
                {/* Full Name Input Field */}
                <div className="mb-6">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </>
            )}

            {/* Email Input Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Password Input Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-xl p-3 rounded-md focus:outline-none transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-600 text-white transform hover:scale-105'
              }`}
            >
              {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </form>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-blue-700">Email: demo@example.com</p>
              <p className="text-xs text-blue-700">Password: password123</p>
            </div>
          )}

          {/* Switch between Login and Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-md text-black-600">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                  >
                    Log In
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
