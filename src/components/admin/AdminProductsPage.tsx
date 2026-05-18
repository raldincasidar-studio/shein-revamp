import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, Database } from 'lucide-react';
import { Product } from '../shopping/ShoppingPage';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { seedProducts } from '../../services/seedService';

const ALL_CATEGORIES = [
  'Women',
  'Women Clothing',
  'Men',
  'Men clothing',
  'Kids',
  'New In',
  'Sale',
  'Just for You',
  'Beachwear',
  'Curve',
  'Shoes',
  'Jewelry & Accessories',
  'Underwear & Sleepwear',
  'Baby & Maternity',
  'Bags & Luggage',
  'Home & Living',
  'Beauty & Health',
  'Sports & Outdoors',
  'Home Textiles',
  'Tools & Home Improvement',
  'Pet Supplies',
  'Tops',
  'Bottoms',
  'Dresses',
  'Accessories',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    rating: 5,
    reviews: 0,
    sold: 0,
    imageUrl: '',
    category: 'Tops',
    description: '',
    sizes: [],
    colors: []
  });

  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setFormData({ name: '', price: 0, rating: 5, reviews: 0, sold: 0, imageUrl: '', category: 'Tops', description: '', sizes: [], colors: [] });
    setSizesInput('');
    setColorsInput('');
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setFormData({
      name: p.name,
      price: p.price,
      rating: p.rating,
      reviews: p.reviews,
      sold: p.sold,
      imageUrl: p.imageUrl,
      category: p.category || 'Tops',
      description: p.description || '',
      sizes: p.sizes || [],
      colors: p.colors || []
    });
    setSizesInput((p.sizes || []).join(', '));
    setColorsInput((p.colors || []).join(', '));
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      sizes: sizesInput.split(',').map(s => s.trim()).filter(Boolean),
      colors: colorsInput.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editingId) {
      await updateProduct(editingId, dataToSave);
    } else {
      await addProduct(dataToSave);
    }
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'reviews' || name === 'sold' ? Number(value) : value
    }));
  };

  const handleSeed = async () => {
    if (confirm('Are you sure you want to seed the database? This will add 40 random products.')) {
      setLoading(true);
      await seedProducts();
      await fetchProducts();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <div className="flex gap-2">
          <button onClick={handleSeed} className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors" title="Seed Data">
            <Database className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={fetchProducts} className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors" title="Refresh">
            <RefreshCw className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={openAddModal}
            className="bg-black text-white px-4 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadowoverflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stats</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No products found. Add one above.</td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded object-cover shadow-sm bg-gray-100" />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 break-words max-w-xs">{p.name}</td>
                      <td className="px-6 py-4">{p.category || 'N/A'}</td>
                      <td className="px-6 py-4 font-semibold text-black">${p.price}</td>
                      <td className="px-6 py-4 space-y-1 text-xs">
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full inline-block mr-1">⭐ {p.rating}</div>
                        <div className="text-gray-500">{p.sold} sold</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEditModal(p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add Product'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price ($)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} min="0" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition bg-white">
                    {ALL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={e => setSizesInput(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={e => setColorsInput(e.target.value)}
                    placeholder="Red, Blue, Black"
                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Rating</label>
                  <input required type="number" name="rating" value={formData.rating} onChange={handleChange} step="0.1" min="0" max="5" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Reviews</label>
                  <input required type="number" name="reviews" value={formData.reviews} onChange={handleChange} min="0" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sold</label>
                  <input required type="number" name="sold" value={formData.sold} onChange={handleChange} min="0" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black outline-none transition" />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded shadow-sm border border-gray-200" />
                )}
              </div>

              <button type="submit" className="w-full bg-black text-white py-3 border border-transparent rounded font-bold hover:bg-gray-800 transition shadow-md">
                {editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  }
}
