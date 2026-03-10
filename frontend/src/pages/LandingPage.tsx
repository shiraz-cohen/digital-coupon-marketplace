import { useNavigate } from 'react-router-dom';
import { UserCircle, ShieldCheck, Ticket } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef4ff] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background soft glow decor */}
      <div className="absolute bottom-10 right-10 opacity-20 text-blue-400">
        <Ticket size={120} className="rotate-12" />
      </div>

      {/* Header Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-5xl font-bold text-[#1e293b] flex items-center gap-1">
            CouponMarket
            <Ticket className="text-[#3b82f6] rotate-[15deg]" size={32} />
          </h1>
        </div>
        <p className="text-[#475569] text-xl font-medium opacity-80 mt-4">
          The most secure way to manage and purchase digital assets.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch mt-4">
        
        {/* Customer Card */}
        <div className="flex-1 bg-white rounded-[32px] p-10 shadow-xl shadow-blue-100/40 flex flex-col items-center text-center transition-transform hover:scale-[1.02] duration-300">
          <div className="w-20 h-20 text-[#1e293b] mb-6">
            <UserCircle size={80} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Customer</h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-10 px-4">
            Browse our marketplace and grab the best digital coupons.
          </p>
          <button 
            onClick={() => navigate('/auth/customer')}
            className="w-full bg-[#7ca3e8] hover:bg-[#6b92d7] text-white font-semibold py-4 rounded-2xl shadow-md transition-all active:scale-95"
          >
            Sign in
          </button>
        </div>

        {/* Admin Card */}
        <div className="flex-1 bg-white rounded-[32px] p-10 shadow-xl shadow-blue-100/40 flex flex-col items-center text-center transition-transform hover:scale-[1.02] duration-300">
          <div className="w-20 h-20 text-[#1e293b] mb-6 flex items-center justify-center">
            <ShieldCheck size={80} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Admin</h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-10 px-4">
            Control inventory, prices, and manage your resellers.
          </p>
          <button 
            onClick={() => navigate('/auth/admin')}
            className="w-full bg-[#7ca3e8] hover:bg-[#6b92d7] text-white font-semibold py-4 rounded-2xl shadow-md transition-all active:scale-95"
          >
            Sign in
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-20 text-[#64748b] text-sm font-medium tracking-wide">
        © 2026 Digital Coupon Marketplace. All rights reserved.
      </footer>
    </div>
  );
}