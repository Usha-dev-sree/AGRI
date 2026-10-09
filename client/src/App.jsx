import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { AIScanner } from './pages/farmer/AIScanner';
import { FarmManager } from './pages/farmer/FarmManager';
import { CropManager } from './pages/farmer/CropManager';
import { WasteLogger } from './pages/farmer/WasteLogger';
import { MyListings } from './pages/farmer/MyListings';
import { FarmerPickups } from './pages/farmer/FarmerPickups';

// Processor Pages
import { ProcessorDashboard } from './pages/processor/ProcessorDashboard';
import { MarketplaceBrowser } from './pages/processor/MarketplaceBrowser';
import { RequirementManager } from './pages/processor/RequirementManager';
import { ProcessorPickups } from './pages/processor/ProcessorPickups';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { PathwayManager } from './pages/admin/PathwayManager';
import { SystemAuditLogs } from './pages/admin/SystemAuditLogs';

// App Layout Shell with responsive Sidebar
const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070d0a] text-slate-100">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Landing / Public Layout
const PublicShell = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070d0a] text-slate-100">
      <Navbar />
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-400">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicShell><LandingPage /></PublicShell>} />
          <Route path="/login" element={<PublicShell><LoginPage /></PublicShell>} />
          <Route path="/register" element={<PublicShell><RegisterPage /></PublicShell>} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={<ProtectedRoute><AppShell><FarmerDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/farmer/ai-scanner" element={<ProtectedRoute><AppShell><AIScanner /></AppShell></ProtectedRoute>} />
          <Route path="/farmer/farms" element={<ProtectedRoute><AppShell><FarmManager /></AppShell></ProtectedRoute>} />
          <Route path="/farmer/crops" element={<ProtectedRoute><AppShell><CropManager /></AppShell></ProtectedRoute>} />
          <Route path="/farmer/waste" element={<ProtectedRoute><AppShell><WasteLogger /></AppShell></ProtectedRoute>} />
          <Route path="/farmer/listings" element={<ProtectedRoute><AppShell><MyListings /></AppShell></ProtectedRoute>} />
          <Route path="/farmer/pickups" element={<ProtectedRoute><AppShell><FarmerPickups /></AppShell></ProtectedRoute>} />

          {/* Processor Routes */}
          <Route path="/processor" element={<ProtectedRoute><AppShell><ProcessorDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/processor/marketplace" element={<ProtectedRoute><AppShell><MarketplaceBrowser /></AppShell></ProtectedRoute>} />
          <Route path="/processor/requirements" element={<ProtectedRoute><AppShell><RequirementManager /></AppShell></ProtectedRoute>} />
          <Route path="/processor/matches" element={<ProtectedRoute><AppShell><MarketplaceBrowser /></AppShell></ProtectedRoute>} />
          <Route path="/processor/pickups" element={<ProtectedRoute><AppShell><ProcessorPickups /></AppShell></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AppShell><AdminDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AppShell><UserManagement /></AppShell></ProtectedRoute>} />
          <Route path="/admin/pathways" element={<ProtectedRoute><AppShell><PathwayManager /></AppShell></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute><AppShell><SystemAuditLogs /></AppShell></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
