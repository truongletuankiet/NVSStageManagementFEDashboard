'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

interface LoginFormProps {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  error: string | null;
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  isRegistering: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ login, register, error, setIsRegistering, isRegistering }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (isRegistering) {
      await register(fullName, email, password, confirmPassword);
    } else {
      await login(email, password);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="relative flex w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Welcome Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">{isRegistering ? 'Glad to see you!' : 'Welcome Back!'}</h2>
          <p className="text-sm text-center">{isRegistering ? 'Join our community and enjoy great music management features.' : 'Sign in to continue your musical journey with us.'}</p>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-12 flex flex-col items-center bg-white">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Image src="/HCMCONS_Logo.png" alt="Nhạc viện TP HCM" width={80} height={80} />
          </motion.div>
          <h2 className="text-2xl font-semibold text-indigo-700 mt-4">{isRegistering ? 'Sign Up' : 'Sign In'}</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4 flex flex-col items-center">
            {isRegistering && (
              <div className="flex items-center border rounded-full p-3 bg-gray-100 w-80 shadow-md">
                <FaUser className="text-gray-500 mx-2" />
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-transparent outline-none" />
              </div>
            )}
            <div className="flex items-center border rounded-full p-3 bg-gray-100 w-80 shadow-md">
              <FaEnvelope className="text-gray-500 mx-2" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-transparent outline-none" />
            </div>
            <div className="flex items-center border rounded-full p-3 bg-gray-100 w-80 shadow-md">
              <FaLock className="text-gray-500 mx-2" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-transparent outline-none" />
            </div>
            {isRegistering && (
              <div className="flex items-center border rounded-full p-3 bg-gray-100 w-80 shadow-md">
                <FaLock className="text-gray-500 mx-2" />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-transparent outline-none" />
              </div>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-80 py-3 text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}
            </motion.button>
            <p className="text-center text-sm mt-2">
              {isRegistering ? 'Already have an account? ' : 'Don’t have an account? '}
              <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
