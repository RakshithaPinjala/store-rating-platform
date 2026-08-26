import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store, LogOut, User, KeyRound, X } from 'lucide-react';
import api from '../api/axiosInstance';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.patch('/auth/update-password', { newPassword });
      setSuccess('Password updated successfully!');
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to update password');
      }
    }
  };

  return (
    <>
      <nav className="bg-amber-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Store className="h-8 w-8 text-amber-100" />
                <span className="font-bold text-xl tracking-tight">WarmRatings</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-amber-100 bg-amber-700/50 px-3 py-1 rounded-full">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name} ({user.role})</span>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center space-x-1 hover:text-amber-200 transition-colors"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span className="hidden sm:inline">Password</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-amber-200 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="hover:text-amber-200 transition-colors">Login</Link>
                  <Link to="/register" className="bg-white text-amber-700 px-4 py-2 rounded-md font-medium hover:bg-amber-50 transition-colors shadow-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50 text-stone-900">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Update Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5"/></button>
            </div>
            
            {success && <div className="text-green-700 bg-green-50 p-3 rounded-md mb-4 text-sm">{success}</div>}
            {error && <div className="text-red-700 bg-red-50 p-3 rounded-md mb-4 text-sm">{error}</div>}
            
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">New Password</label>
                <input 
                  type="password" 
                  required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$" title="8-16 characters, 1 uppercase, 1 special character"
                  className="mt-1 w-full border border-stone-300 p-2 rounded focus:ring-amber-500 focus:border-amber-500" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                />
                <p className="mt-1 text-xs text-stone-500">8-16 chars, 1 uppercase, 1 special (!@#$%^&*)</p>
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white p-2 rounded hover:bg-amber-700 font-medium">Update</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
