import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm px-3 px-md-4"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      <Link
        className="navbar-brand fw-bold fs-4"
        to="/"
        style={{ color: '#e94560' }}
      >
        ✍️ BlogSphere
      </Link>

      <button
        className="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        style={{ filter: 'invert(1)' }}
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav ms-auto align-items-lg-center gap-1 gap-lg-2 py-2 py-lg-0">
          <li className="nav-item">
            <Link className="nav-link text-light" to="/">🏠 Home</Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/create">✏️ New Post</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/bookmarks">🔖 Bookmarks</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/dashboard">📊 Dashboard</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link text-white-50 small d-none d-lg-block">
                  👤 {user.name}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3 w-100 w-lg-auto"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/login">Login</Link>
              </li>
              <li className="nav-item mt-1 mt-lg-0">
                <Link
                  className="btn btn-sm rounded-pill px-3 w-100 w-lg-auto text-center"
                  to="/signup"
                  style={{ backgroundColor: '#e94560', color: '#fff' }}
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}