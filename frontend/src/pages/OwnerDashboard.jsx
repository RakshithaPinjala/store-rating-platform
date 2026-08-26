import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Store as StoreIcon, Star, Users } from 'lucide-react';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-stone-500">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">No store found for this account.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">Store Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 flex items-center">
          <div className="p-4 bg-amber-100 rounded-full text-amber-700 mr-6">
            <StoreIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Store Name</p>
            <p className="text-2xl font-bold text-stone-900">{data.store.name}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-stone-200 flex items-center">
          <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 mr-6">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500">Average Rating</p>
            <p className="text-2xl font-bold text-stone-900">{data.store.averageRating} / 5</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg border border-stone-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 bg-stone-50 flex items-center">
          <Users className="w-5 h-5 text-stone-500 mr-2" />
          <h3 className="text-lg font-medium text-stone-900">Recent Ratings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {data.raters.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-stone-500">No ratings yet.</td></tr>
              ) : (
                data.raters.map(r => (
                  <tr key={r.ratingId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{r.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{r.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                        {r.value} Stars
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
