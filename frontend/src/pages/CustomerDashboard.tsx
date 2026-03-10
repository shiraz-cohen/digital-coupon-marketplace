import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, Ticket, LogOut, CheckCircle2, AlertCircle, X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

interface PurchaseResult {
  product_id: string;
  final_price: number;
  value_type: 'STRING' | 'IMAGE';
  value: string;
}

export default function CustomerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const fetchAvailableProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/v1/customer/products', authHeaders);
      setProducts(res.data);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchAvailableProducts();
  }, [fetchAvailableProducts]);

  const handlePurchase = async () => {
    if (!selectedProduct) return;
    
    setIsPurchasing(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/customer/products/${selectedProduct.id}/purchase`,
        { reseller_price: selectedProduct.price },
        authHeaders
      );
      
      setPurchaseResult(res.data);
      setSelectedProduct(null);
      fetchAvailableProducts();
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Purchase failed";
      alert(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.id.toLowerCase().includes(searchId.toLowerCase()) || 
    p.name.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <Ticket className="rotate-[15deg]" />
            <span>CouponMarket</span>
          </div>
          
          <div className="flex-1 max-w-md mx-10 relative">
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-blue-400 transition-all outline-none"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>

          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Available Coupons</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64 italic text-slate-400">Loading amazing deals...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-white group"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-bold text-blue-600 shadow-sm">
                    ${product.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-slate-800 mb-2">{product.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">{product.description}</p>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Buy Now
                  </button>
                  <p className="text-[10px] text-slate-300 mt-4 text-center font-mono italic">ID: {product.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">No coupons found matching your search.</p>
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] max-w-md w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-2">Confirm Purchase</h3>
            <p className="text-slate-500 mb-6">You are about to purchase <span className="font-bold text-slate-800">{selectedProduct.name}</span></p>
            
            <div className="bg-slate-50 p-6 rounded-3xl mb-8">
              <div className="flex justify-between mb-2 text-sm text-slate-500 font-medium">
                <span>Total Amount:</span>
                <span>$ {selectedProduct.price}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-xl text-slate-800">
                <span>Total to Pay:</span>
                <span>$ {selectedProduct.price}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                disabled={isPurchasing}
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isPurchasing}
                onClick={handlePurchase}
                className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {isPurchasing ? 'Processing...' : <><CreditCard size={20} /> Confirm & Pay</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {purchaseResult && (
        <div className="fixed inset-0 bg-blue-600/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] max-w-md w-full p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-400"></div>
            <CheckCircle2 className="mx-auto text-green-500 mb-6" size={64} />
            <h3 className="text-3xl font-bold text-slate-800 mb-2">Success!</h3>
            <p className="text-slate-500 mb-8">Your coupon is ready to use</p>
            
            <div className="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-3xl mb-8">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">Your Coupon Code</span>
              {purchaseResult.value_type === 'IMAGE' ? (
                <img src={purchaseResult.value} className="mx-auto max-h-48 rounded-lg" alt="coupon" />
              ) : (
                <code className="text-2xl font-black text-blue-700 tracking-wider break-all">{purchaseResult.value}</code>
              )}
            </div>

            <button 
              onClick={() => setPurchaseResult(null)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}