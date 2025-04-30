import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InvestmentPlans from './components/InvestmentPlans';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';
import WithdrawalFeed from './components/WithdrawalFeed';
import FAQ from './components/FAQ';
import Legal from './components/Legal';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { useWallet } from './context/WalletContext';
import { useAdmin } from './context/AdminContext';

function AppContent() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useWallet();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const handleShowFAQ = () => {
      setShowFAQ(true);
      setShowDashboard(false);
      setShowLegal(false);
      setShowPlans(false);
      window.scrollTo(0, 0);
    };

    const handleShowLegal = () => {
      setShowLegal(true);
      setShowDashboard(false);
      setShowFAQ(false);
      setShowPlans(false);
      window.scrollTo(0, 0);
    };

    const handleShowPlans = () => {
      setShowPlans(true);
      setShowFAQ(false);
      setShowLegal(false);
      window.scrollTo(0, 0);
    };

    window.addEventListener('showFAQ', handleShowFAQ);
    window.addEventListener('showLegal', handleShowLegal);
    window.addEventListener('showPlans', handleShowPlans);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('showFAQ', handleShowFAQ);
      window.removeEventListener('showLegal', handleShowLegal);
      window.removeEventListener('showPlans', handleShowPlans);
    };
  }, []);

  const handlePlansClick = () => {
    if (showDashboard) {
      setShowPlans(true);
    } else {
      const plansSection = document.getElementById('plans');
      if (plansSection) {
        const yOffset = -80;
        const y = plansSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onDashboardClick={() => {
          setShowDashboard(!showDashboard);
          setShowFAQ(false);
          setShowLegal(false);
          setShowPlans(false);
        }} 
        onPlansClick={handlePlansClick}
        showDashboard={showDashboard}
      />
      
      <main className="flex-grow">
        {showDashboard ? (
          isConnected ? (
            isAdmin ? (
              showPlans ? <InvestmentPlans /> : <AdminDashboard />
            ) : (
              <Dashboard onViewPlans={() => setShowPlans(true)} />
            )
          ) : (
            <Hero />
          )
        ) : showFAQ ? (
          <FAQ />
        ) : showLegal ? (
          <Legal />
        ) : (
          <>
            <Hero />
            <InvestmentPlans />
          </>
        )}
      </main>
      
      <Footer />
      <WithdrawalFeed />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <ThemeProvider>
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </ThemeProvider>
    </AdminProvider>
  );
}

export default App;