import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      
      const role = res.data.user.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'STORE_OWNER') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-amber-100 p-3 rounded-full">
            <LogIn className="w-8 h-8 text-amber-700" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 font-serif">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Or <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">create a new account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-amber-900/5 sm:rounded-lg sm:px-10 border border-stone-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-stone-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email" required
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">Password</label>
              <div className="mt-1">
                <input
                  type="password" required
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
