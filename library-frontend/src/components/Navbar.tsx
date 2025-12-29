
import { FaBook, FaSignOutAlt, FaUserCircle, FaChartBar, FaHome } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
            <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <FaBook className="text-white text-xl" />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        LMS Premium
                    </h1>
                </Link>

                <div className="hidden md:flex items-center space-x-1">
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
                        <FaHome /> Home
                    </Link>
                    <Link to="/analytics" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition">
                        <FaChartBar /> Analytics
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-300">
                    <FaUserCircle className="text-xl" />
                    <span className="font-medium">{user?.name}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
