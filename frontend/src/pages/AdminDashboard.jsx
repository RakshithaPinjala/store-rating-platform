import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Users, Store, Star, Plus, Search, X } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSort, setUserSort] = useState('name-asc');
  
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSort, setStoreSort] = useState('name-asc');

  // Modals state
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // For user details modal

  // Forms state
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerName: '', ownerEmail: '', ownerPassword: '', ownerAddress: '' });
  const [formError, setFormError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [uSortBy, uOrder] = userSort.split('-');
      const [sSortBy, sOrder] = storeSort.split('-');

      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/users', { params: { search: userSearch, role: userRoleFilter, sortBy: uSortBy, order: uOrder } }),
        api.get('/admin/stores', { params: { search: storeSearch, sortBy: sSortBy, order: sOrder } })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, [userSearch, userRoleFilter, userSort, storeSearch, storeSort]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/users', userForm);
      setShowAddUser(false);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchDashboardData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/admin/stores', storeForm);
      setShowAddStore(false);
      setStoreForm({ name: '', email: '', address: '', ownerName: '', ownerEmail: '', ownerPassword: '', ownerAddress: '' });
      fetchDashboardData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create store');
    }
  };

  const openUserDetails = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user details');
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Loading admin dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <h1 className="text-3xl font-serif font-bold text-stone-800 mb-8">System Administration</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex items-center">
          <div className="p-4 bg-blue-100 rounded-full text-blue-600 mr-4"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-stone-500">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex items-center">
          <div className="p-4 bg-amber-100 rounded-full text-amber-600 mr-4"><Store className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-stone-500">Total Stores</p><p className="text-2xl font-bold">{stats.totalStores}</p></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex items-center">
          <div className="p-4 bg-green-100 rounded-full text-green-600 mr-4"><Star className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-stone-500">Total Ratings</p><p className="text-2xl font-bold">{stats.totalRatings}</p></div>
        </div>
      </div>

      {/* Users Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-stone-800">Users</h2>
          <button onClick={() => setShowAddUser(true)} className="mt-4 md:mt-0 flex items-center bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </button>
        </div>
        
        <div className="bg-white p-4 border border-stone-200 rounded-t-lg flex flex-col md:flex-row gap-4 bg-stone-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input type="text" placeholder="Search name, email, address..." className="pl-9 pr-3 py-2 w-full border rounded text-sm focus:ring-amber-500" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
          </div>
          <select className="border rounded py-2 px-3 text-sm" value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="NORMAL_USER">Normal User</option>
          </select>
          <select className="border rounded py-2 px-3 text-sm" value={userSort} onChange={e => setUserSort(e.target.value)}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
          </select>
        </div>

        <div className="bg-white shadow-sm border-x border-b border-stone-200 rounded-b-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Name & Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 text-sm font-medium text-stone-900">{u.name}<br/><span className="font-normal text-stone-500">{u.email}</span></td>
                  <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">{u.address}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : u.role === 'STORE_OWNER' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => openUserDetails(u.id)} className="text-amber-600 hover:text-amber-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stores Section */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-stone-800">Stores</h2>
          <button onClick={() => setShowAddStore(true)} className="mt-4 md:mt-0 flex items-center bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" /> Add Store
          </button>
        </div>
        
        <div className="bg-white p-4 border border-stone-200 rounded-t-lg flex flex-col md:flex-row gap-4 bg-stone-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input type="text" placeholder="Search name, email, address..." className="pl-9 pr-3 py-2 w-full border rounded text-sm focus:ring-amber-500" value={storeSearch} onChange={e => setStoreSearch(e.target.value)} />
          </div>
          <select className="border rounded py-2 px-3 text-sm" value={storeSort} onChange={e => setStoreSort(e.target.value)}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
            <option value="email-desc">Email (Z-A)</option>
          </select>
        </div>

        <div className="bg-white shadow-sm border-x border-b border-stone-200 rounded-b-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {stores.map(s => (
                <tr key={s.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 text-sm font-medium text-stone-900">{s.name}<br/><span className="font-normal text-stone-500">{s.email}</span></td>
                  <td className="px-6 py-4 text-sm text-stone-500 max-w-xs truncate">{s.address}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    <span className="flex items-center text-amber-600 font-bold">{s.averageRating} <Star className="w-4 h-4 ml-1 fill-amber-600" /></span>
                    <span className="text-xs font-normal text-stone-400">{s.totalRatings} ratings</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add User</h3>
              <button onClick={() => setShowAddUser(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5"/></button>
            </div>
            {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Name" required className="w-full border p-2 rounded" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
              <input type="email" placeholder="Email" required className="w-full border p-2 rounded" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
              <input type="password" placeholder="Password" required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$" title="8-16 characters, 1 uppercase, 1 special character" className="w-full border p-2 rounded" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
              <textarea placeholder="Address" required className="w-full border p-2 rounded" value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} />
              <select className="w-full border p-2 rounded" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="ADMIN">Admin User</option>
              </select>
              <button type="submit" className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700">Create User</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddStore && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Store & Owner</h3>
              <button onClick={() => setShowAddStore(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5"/></button>
            </div>
            {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}
            <form onSubmit={handleCreateStore} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-700 border-b pb-2">Store Details</h4>
                  <input type="text" placeholder="Store Name" required className="w-full border p-2 rounded" value={storeForm.name} onChange={e => setStoreForm({...storeForm, name: e.target.value})} />
                  <input type="email" placeholder="Store Email" required className="w-full border p-2 rounded" value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} />
                  <textarea placeholder="Store Address" required className="w-full border p-2 rounded" value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-stone-700 border-b pb-2">Owner Details</h4>
                  <input type="text" placeholder="Owner Name" required className="w-full border p-2 rounded" value={storeForm.ownerName} onChange={e => setStoreForm({...storeForm, ownerName: e.target.value})} />
                  <input type="email" placeholder="Owner Email" required className="w-full border p-2 rounded" value={storeForm.ownerEmail} onChange={e => setStoreForm({...storeForm, ownerEmail: e.target.value})} />
                  <input type="password" placeholder="Owner Password" required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$" title="8-16 characters, 1 uppercase, 1 special character" className="w-full border p-2 rounded" value={storeForm.ownerPassword} onChange={e => setStoreForm({...storeForm, ownerPassword: e.target.value})} />
                  <textarea placeholder="Owner Address" required className="w-full border p-2 rounded" value={storeForm.ownerAddress} onChange={e => setStoreForm({...storeForm, ownerAddress: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700">Create Store & Owner</button>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
              <div><p className="text-sm text-stone-500">Name</p><p className="font-medium">{selectedUser.name}</p></div>
              <div><p className="text-sm text-stone-500">Email</p><p className="font-medium">{selectedUser.email}</p></div>
              <div><p className="text-sm text-stone-500">Role</p><p className="font-medium">{selectedUser.role}</p></div>
              <div><p className="text-sm text-stone-500">Address</p><p className="font-medium">{selectedUser.address}</p></div>
              
              {selectedUser.role === 'STORE_OWNER' && selectedUser.store && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-2">Owned Store</h4>
                  <p className="font-medium">{selectedUser.store.name}</p>
                  <p className="text-sm text-amber-700 flex items-center mt-1">Rating: {selectedUser.store.averageRating} <Star className="w-4 h-4 ml-1 fill-amber-600" /></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
