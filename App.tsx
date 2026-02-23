import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrustBadges from './components/TrustBadges';
import QualitySection from './components/QualitySection';
import BestSellersSection from './components/BestSellersSection';
import TeamSection from './components/TeamSection';
import EShopPage from './components/EShopPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import CartDrawer from './components/CartDrawer';
import { ContentProvider, useContent } from './ContentContext';
import { CartProvider } from './CartContext';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/LoginPage';

type Page = 'home' | 'shop' | 'about' | 'contact';

const HomePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const { content } = useContent();
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <TrustBadges />
      <QualitySection />
      <BestSellersSection onNavigate={onNavigate} />
      {content.teamVisible && <TeamSection />}
      {/* Slim footer for homepage */}
      <footer className="bg-gray-900 text-white py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} {content.branding.brandName || 'Anker Chicken'}. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-3">
          <button onClick={() => onNavigate('about')} className="hover:text-red-400 transition-colors">About</button>
          <button onClick={() => onNavigate('shop')} className="hover:text-red-400 transition-colors">E-Shop</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-red-400 transition-colors">Contact</button>
        </div>
      </footer>
    </>
  );
};

const AppContent: React.FC = () => {
  const { isAdmin, setIsAdmin } = useContent();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAuthenticated) setShowLogin(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
        setIsAdmin(true);
      }
    } catch {
      // Not authenticated
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleAdminToggle = () => {
    const now = Date.now();
    if (now - lastClickTime > 1000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClickTime(now);
    if (clickCount >= 2) {
      setShowLogin(true);
      setClickCount(0);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setIsAdmin(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setShowLogin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showLogin && !isAuthenticated) return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  if (isAdmin && isAuthenticated) return <AdminDashboard onLogout={handleLogout} />;
  if (checkingAuth) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'shop': return <EShopPage onNavigate={navigate} />;
      case 'about': return <AboutPage onNavigate={navigate} />;
      case 'contact': return <ContactPage onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={navigate} currentPage={currentPage} />
      {renderPage()}
      <CartDrawer />

      {/* Invisible Admin Toggle — Triple Click */}
      <button
        onClick={handleAdminToggle}
        className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-transparent opacity-0 hover:opacity-10 cursor-default z-50"
        aria-label="Admin Access"
      />

      {/* Visible admin re-entry when session is active */}
      {isAuthenticated && !isAdmin && (
        <button
          onClick={() => setIsAdmin(true)}
          className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
          title="Open Admin Dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 4a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <ContentProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ContentProvider>
  );
}

export default App;
