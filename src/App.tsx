import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { useTheme } from './hooks/useTheme';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      <Header />
      <main>
        <Dashboard />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            border: isDark ? '1px solid #4B5563' : '1px solid #E5E7EB',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;