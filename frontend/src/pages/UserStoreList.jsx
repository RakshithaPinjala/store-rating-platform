import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import { Search, MapPin } from 'lucide-react';

const UserStoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const { user } = useContext(AuthContext);

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores', { params: { search, sortBy, order } });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, order]);

  const handleRatingSubmit = async (storeId, value) => {
    try {
      await api.post(`/stores/${storeId}/rate`, { value });
      fetchStores(); // Refresh list to show updated ratings
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-stone-800">Discover Stores</h1>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or address..."
              className="pl-10 pr-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            className="border border-stone-300 rounded-md py-2 px-3 focus:ring-amber-500 focus:border-amber-500 bg-white"
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setSortBy(s);
              setOrder(o);
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <div key={store.id} className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-900 mb-2">{store.name}</h3>
              <p className="flex items-start text-stone-600 mb-4 text-sm">
                <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-amber-600" />
                {store.address}
              </p>
              
              <div className="bg-stone-50 p-4 rounded-md border border-stone-100 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-stone-500">Overall Rating</span>
                  <span className="text-lg font-bold text-amber-600">{store.overallRating} / 5</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <p className="text-sm font-medium text-stone-700 mb-2">
                  {store.userSubmittedRating ? 'Update your rating' : 'Submit a rating'}
                </p>
                <StarRating
                  currentRating={store.userSubmittedRating || 0}
                  onRatingSubmit={(val) => handleRatingSubmit(store.id, val)}
                />
              </div>
            </div>
          </div>
        ))}
        {stores.length === 0 && (
          <div className="col-span-full text-center py-12 text-stone-500">
            No stores found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStoreList;
