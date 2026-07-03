import React, { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MantineProvider, createTheme, Center, Loader } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InstallPrompt } from './components/InstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { UpdatePrompt } from './components/UpdatePrompt';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';

// Lazy-loaded pages — only downloaded when the user navigates to them
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const EquipmentResults = lazy(() => import('./pages/EquipmentResults').then(m => ({ default: m.EquipmentResults })));
const EquipmentDetails = lazy(() => import('./pages/EquipmentDetails').then(m => ({ default: m.EquipmentDetails })));
const NearMeLocator = lazy(() => import('./pages/NearMeLocator').then(m => ({ default: m.NearMeLocator })));
const CompanyDirectory = lazy(() => import('./pages/CompanyDirectory').then(m => ({ default: m.CompanyDirectory })));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile').then(m => ({ default: m.CompanyProfile })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const PostListing = lazy(() => import('./pages/PostListing').then(m => ({ default: m.PostListing })));
const Favorites = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <Center mih="50vh">
      <Loader color="brand.5" size="lg" />
    </Center>
  );
}

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

        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
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
