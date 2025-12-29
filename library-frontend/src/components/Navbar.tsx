
import { FaBook, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

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
            <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <FaBook className="text-white text-xl" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    LMS Premium
                </h1>
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
