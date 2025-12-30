import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MainLayout from './components/MainLayout';
import { useAppSelector } from './hooks/redux';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <AnalyticsDashboard />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
