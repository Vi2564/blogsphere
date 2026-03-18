import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      alert('Invalid email or password.');
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: '85vh' }}
    >
      <div
        className="card border-0 shadow rounded-4 p-4"
        style={{ maxWidth: 420, width: '100%', backgroundColor: '#f8f9ff' }}
      >
        <h3
          className="mb-2 text-center fw-bold"
          style={{ color: '#1a1a2e' }}
        >
          Welcome Back
        </h3>
        <p className="text-muted text-center mb-4">
          Login to continue writing and reading blogs
        </p>

        <form onSubmit={handleLogin} className="d-grid gap-3">
          <input
            type="email"
            className="form-control rounded-pill px-3"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control rounded-pill px-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="btn rounded-pill py-2 text-white"
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#e94560' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted mb-1">Don't have an account?</p>
          <Link
            to="/signup"
            className="fw-semibold text-decoration-none"
            style={{ color: '#e94560' }}
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}