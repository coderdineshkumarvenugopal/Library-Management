import { FaBook, FaSignOutAlt, FaUserCircle, FaChartBar, FaHome, FaSun, FaMoon } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import { toggleTheme } from '../store/uiSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const { theme } = useAppSelector((state) => state.ui);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300">
            <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <FaBook className="text-white text-xl" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                        LMS Premium
                    </h1>
                </Link>

                <div className="hidden md:flex items-center space-x-1">
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl transition">
                        <FaHome /> Home
                    </Link>
                    <Link to="/analytics" className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/5 rounded-xl transition">
                        <FaChartBar /> Analytics
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-600" />}
                </button>

                <div className="hidden sm:flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <FaUserCircle className="text-xl" />
                    <span className="font-medium">{user?.name}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                    <FaSignOutAlt />
                    <span className="hidden xs:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
