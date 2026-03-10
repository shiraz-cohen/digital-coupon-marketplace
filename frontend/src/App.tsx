import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/customer" element={<AuthPage type="CUSTOMER" />} />
        <Route path="/auth/admin" element={<AuthPage type="ADMIN" />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/shop" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;