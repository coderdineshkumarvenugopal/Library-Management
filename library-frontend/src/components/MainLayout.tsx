import React from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
