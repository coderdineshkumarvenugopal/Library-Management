import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/api/auth/login', { email, password });
            dispatch(loginSuccess({ token: response.data.token, user: response.data }));
            navigate('/');
        } catch (err: any) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
            >
                <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Welcome Back
                </h2>

                {error && <div className="p-3 mb-4 text-sm text-red-200 bg-red-900/50 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500"
                            required
                        />
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder-gray-500"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
                    >
                        Sign In
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
