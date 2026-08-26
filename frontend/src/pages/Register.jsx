import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-amber-100 p-3 rounded-full">
            <UserPlus className="w-8 h-8 text-amber-700" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 font-serif">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Already have an account? <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">Sign in</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-amber-900/5 sm:rounded-lg sm:px-10 border border-stone-100">
          {success ? (
            <div className="text-green-700 bg-green-50 p-4 rounded-md border border-green-200 text-center">
              <p className="font-medium">Registration successful!</p>
              <p className="text-sm mt-1">Redirecting to login...</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-stone-700">Full Name</label>
                <div className="mt-1">
                  <input
                    type="text" name="name" required minLength={20} maxLength={60}
                    className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    value={formData.name} onChange={handleChange} placeholder="e.g. Johnathan Christopher Doe"
                  />
                </div>
                <p className="mt-1 text-xs text-stone-400">Must be 20-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email" name="email" required
                    className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Address</label>
                <div className="mt-1">
                  <textarea
                    name="address" required maxLength={400} rows={3}
                    className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    value={formData.address} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Password</label>
                <div className="mt-1">
                  <input
                    type="password" name="password" required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$" title="8-16 characters, 1 uppercase, 1 special character"
                    className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-stone-400">8-16 chars, 1 uppercase, 1 special (!@#$%^&*)</p>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
