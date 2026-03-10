import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/customer" element={<AuthPage type="CUSTOMER" />} />
        <Route path="/auth/admin" element={<AuthPage type="ADMIN" />} />
        
        {/* Placeholder routes for future pages */}
        <Route path="/shop" element={<div className="p-10 text-center">Shop Page (Coming Soon)</div>} />
        <Route path="/admin/dashboard" element={<div className="p-10 text-center">Admin Dashboard (Coming Soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;