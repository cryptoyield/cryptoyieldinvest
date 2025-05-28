import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InvestmentPlans from './components/InvestmentPlans';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';
import FAQ from './components/FAQ';
import Legal from './components/Legal';
import { WalletProvider, useWallet } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { WithdrawalFeedProvider } from './components/WithdrawalFeed';
import WithdrawalFeed from './components/WithdrawalFeed';
import HowItWorks from './components/HowItWorks'; // <--- Importar el componente HowItWorks
import { GoogleOAuthProvider } from '@react-oauth/google'; // <--- Importar GoogleOAuthProvider

// Definición de los posibles estados de la aplicación
const AppState = {
  HOME: 'home',
  DASHBOARD: 'dashboard',
  PLANS: 'plans',
  FAQ: 'faq',
  LEGAL: 'legal'
};

function AppContent() {
  // Estado unificado para la navegación
  const [currentView, setCurrentView] = useState(AppState.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlansInDashboard, setShowPlansInDashboard] = useState(false);
  
  const { isConnected } = useWallet();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    // Simulación de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Manejadores de eventos para navegación
    const handleShowFAQ = () => {
      setCurrentView(AppState.FAQ);
      setShowPlansInDashboard(false);
      window.scrollTo(0, 0);
    };

    const handleShowLegal = () => {
      setCurrentView(AppState.LEGAL);
      setShowPlansInDashboard(false);
      window.scrollTo(0, 0);
    };

    const handleShowPlans = () => {
      setCurrentView(AppState.PLANS);
      window.scrollTo(0, 0);
    };

    // Registrar event listeners para navegación
    window.addEventListener('showFAQ', handleShowFAQ);
    window.addEventListener('showLegal', handleShowLegal);
    window.addEventListener('showPlans', handleShowPlans);

    // Limpieza al desmontar
    return () => {
      clearTimeout(timer);
      window.removeEventListener('showFAQ', handleShowFAQ);
      window.removeEventListener('showLegal', handleShowLegal);
      window.removeEventListener('showPlans', handleShowPlans);
    };
  }, []);

  // Función para manejar clic en planes de inversión
  const handlePlansClick = () => {
    if (currentView === AppState.DASHBOARD) {
      setShowPlansInDashboard(true);
    } else {
      // Si no está en dashboard, desplazar a la sección de planes
      const plansSection = document.getElementById('plans');
      if (plansSection) {
        const yOffset = -80;
        const y = plansSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Función para manejar clic en el dashboard
  const handleDashboardClick = () => {
    if (currentView === AppState.DASHBOARD) {
      // Si ya está en dashboard, volver a home
      setCurrentView(AppState.HOME);
    } else {
      // Si no está en dashboard, ir a dashboard
      setCurrentView(AppState.DASHBOARD);
      setShowPlansInDashboard(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Renderizar el contenido principal según el estado actual
  const renderMainContent = () => {
    switch (currentView) {
      case AppState.DASHBOARD:
        if (!isConnected) return <Hero />;
        
        if (isAdmin) {
          return showPlansInDashboard ? <InvestmentPlans /> : <AdminDashboard />;
        }
        
        return <Dashboard onViewPlans={() => setShowPlansInDashboard(true)} />;
        
      case AppState.FAQ:
        return <FAQ />;
        
      case AppState.LEGAL:
        return <Legal />;
        
      case AppState.PLANS:
        return <InvestmentPlans />;
        
      case AppState.HOME:
      default:
        return (
          <>
            <Hero />
            <HowItWorks /> {/* <--- Añadir el componente HowItWorks aquí */}
            <InvestmentPlans />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onDashboardClick={handleDashboardClick}
        onPlansClick={handlePlansClick}
        showDashboard={currentView === AppState.DASHBOARD}
      />
      
      <main className="flex-grow">
        {renderMainContent()}
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  // Obtener el ID de cliente de Google de las variables de entorno
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

  // Opcional: Mostrar un error si la variable no está configurada (útil en desarrollo)
  if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID is not defined. Please set it in your .env file for local development or in Vercel environment variables for deployment.");
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: Google Client ID not configured.</div>;
  }

  return (
    // Envolver toda la aplicación con GoogleOAuthProvider
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> 
      <AdminProvider>
        <ThemeProvider>
          <WalletProvider>
            <WithdrawalFeedProvider>
              <AppContent />
              <WithdrawalFeed />
            </WithdrawalFeedProvider>
          </WalletProvider>
        </ThemeProvider>
      </AdminProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
