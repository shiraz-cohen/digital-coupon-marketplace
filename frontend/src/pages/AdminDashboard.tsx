import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { PlusCircle, LayoutList, Search, Trash2, Edit3, LogOut, Ticket, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  image_url: string;
  cost_price: number;
  margin_percentage: number;
  minimum_sell_price: number;
  value_type: 'STRING' | 'IMAGE';
  value: string;
  is_sold: boolean; 
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [searchId, setSearchId] = useState('');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<AdminProduct | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    costPrice: 0,
    marginPercentage: 0,
    valueType: 'STRING' as 'STRING' | 'IMAGE',
    value: ''
  });

  const token = localStorage.getItem('token');
  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const getProductsFromApi = useCallback(async (): Promise<AdminProduct[]> => {
    if (!token) return [];
    try {
      const res = await axios.get('http://localhost:3000/api/v1/admin/products', authHeaders);
      return res.data;
    } catch { return []; }
  }, [authHeaders, token]);

  useEffect(() => {
    getProductsFromApi().then(data => {
      if (data) setProducts(data);
    });
  }, [getProductsFromApi]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/admin/products/${id}`, authHeaders);
      const data = await getProductsFromApi();
      setProducts(data);
    } catch { alert("Delete failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:3000/api/v1/admin/products/${editingProduct.id}`, formData, authHeaders);
      } else {
        await axios.post('http://localhost:3000/api/v1/admin/products', formData, authHeaders);
      }
      setFormData({ name: '', description: '', imageUrl: '', costPrice: 0, marginPercentage: 0, valueType: 'STRING', value: '' });
      setEditingProduct(null);
      setActiveTab('list');
      const data = await getProductsFromApi();
      setProducts(data);
    } catch { alert("Action failed"); }
  };

  const openEdit = (e: React.MouseEvent, product: AdminProduct) => {
    e.stopPropagation();
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.image_url,
      costPrice: Number(product.cost_price),
      marginPercentage: Number(product.margin_percentage),
      valueType: product.value_type,
      value: product.value
    });
    setActiveTab('add');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl flex flex-col p-6 sticky h-screen top-0 z-20">
        <div className="flex items-center gap-2 mb-10 px-2">
          <Ticket className="text-blue-600 rotate-[15deg]" size={28} />
          <h1 className="text-xl font-bold">Admin Console</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => { setActiveTab('list'); setEditingProduct(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
            <LayoutList size={20} /> Inventory
          </button>
          <button onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
            <PlusCircle size={20} /> {editingProduct ? 'Edit Product' : 'Add Product'}
          </button>
        </nav>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'list' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Product Management</h2>
                <div className="relative w-72">
                  <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <th className="px-8 py-5">Product Details</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5">Sell Price</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.filter(p => p.name.toLowerCase().includes(searchId.toLowerCase()) || p.id.includes(searchId)).map((product) => (
                      <tr key={product.id} onClick={() => setViewingProduct(product)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={product.image_url} className="w-12 h-12 rounded-2xl object-cover shadow-sm bg-slate-100" alt="" />
                            <div>
                              <div className="font-bold text-slate-700">{product.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono italic">{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          {product.is_sold ? (
                            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">Sold</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">Available</span>
                          )}
                        </td>
                        <td className="px-8 py-5 font-bold text-blue-600">${product.minimum_sell_price}</td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button onClick={(e) => { e.stopPropagation(); setViewingProduct(product); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                          <button onClick={(e) => openEdit(e, product)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Edit3 size={18} /></button>
                          <button onClick={(e) => handleDelete(e, product.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-2xl bg-white rounded-[40px] p-12 shadow-xl border border-white mx-auto relative animate-in zoom-in-95">
              <h2 className="text-3xl font-black mb-8">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input type="text" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={formData.name} required onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea rows={3} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={formData.description} required onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                  <input type="text" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={formData.imageUrl} required onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cost ($)</label>
                  <input type="number" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={formData.costPrice} required onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Margin (%)</label>
                  <input type="number" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={formData.marginPercentage} required onChange={e => setFormData({...formData, marginPercentage: Number(e.target.value)})} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Coupon Value</label>
                  <input type="text" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-400 font-mono" value={formData.value} required onChange={e => setFormData({...formData, value: e.target.value})} />
                </div>
                <button type="submit" className="col-span-2 bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest">
                  {editingProduct ? 'Update Product' : 'Add to Store'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Quick View Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="relative h-56">
              <img src={viewingProduct.image_url} className="w-full h-full object-cover" alt="" />
              <button onClick={() => setViewingProduct(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-slate-800"><X size={20} /></button>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">{viewingProduct.name}</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">{viewingProduct.description}</p>
              <div className="flex justify-around bg-slate-50 p-6 rounded-3xl">
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</div>
                    <div className={`font-black ${viewingProduct.is_sold ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {viewingProduct.is_sold ? 'SOLD' : 'AVAILABLE'}
                    </div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sell Price</div>
                    <div className="font-black text-blue-600">${viewingProduct.minimum_sell_price}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}