import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InstallPrompt } from './components/InstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { UpdatePrompt } from './components/UpdatePrompt';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Home } from './pages/Home';
import { EquipmentResults } from './pages/EquipmentResults';
import { EquipmentDetails } from './pages/EquipmentDetails';
import { NearMeLocator } from './pages/NearMeLocator';
import { CompanyDirectory } from './pages/CompanyDirectory';
import { CompanyProfile } from './pages/CompanyProfile';
import { Pricing } from './pages/Pricing';
import { PostListing } from './pages/PostListing';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

// Create a custom theme with the requested colors and typography
const theme = createTheme({
  primaryColor: 'brand',
  fontFamily: 'Cairo, sans-serif',
  headings: {
    fontFamily: 'Cairo, sans-serif'
  },
  colors: {
    // Custom gold color palette
    brand: [
    '#FDF8E8',
    '#F9EFCB',
    '#F3DE8E',
    '#EDCD50',
    '#E8BE1D',
    '#D4A017',
    '#B3850F',
    '#8F6909',
    '#6E5005',
    '#503802']

  },
  components: {
    Button: {
      defaultProps: {
        fw: 600
      }
    }
  }
});

function AppLayout() {
  const location = useLocation();
  const isLocatorPage = location.pathname === '/locator';

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>

      <OfflineIndicator />
      <Header />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<EquipmentResults />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/locator" element={<NearMeLocator />} />
          <Route path="/companies" element={<CompanyDirectory />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/post-listing" element={<PostListing />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isLocatorPage && <Footer />}

      <InstallPrompt />
      <UpdatePrompt />
      <AuthModal />
    </div>);

}

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-center" dir="rtl" />
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </MantineProvider>);

}
