import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080/api';

const cardStyle = (delay = 0) => ({
  animation: `fadeUp 0.6s ease forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
});

export default function Dashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [posts, setPosts]   = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${API_URL}/posts/user/${user.id}`).then((r) => r.json()),
      fetch(`${API_URL}/posts/user/${user.id}/stats`).then((r) => r.json()),
    ])
      .then(([postData, statsData]) => {
        setPosts(postData);
        setStats(statsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) return <p className="text-center my-5 text-muted">Loading dashboard...</p>;

  return (
    <div className="container my-4 my-md-5 px-3" style={{ maxWidth: 900 }}>
      <h3 className="mb-4 fw-bold text-center" style={{ color: '#1a1a2e' }}>
        Welcome, {user?.name || 'Writer'}! 👋
      </h3>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Posts',     value: stats?.totalPosts     || 0, color: '#1a1a2e', delay: 0.1 },
          { label: 'Total Views',     value: stats?.totalViews     || 0, color: '#0f3460', delay: 0.2 },
          { label: 'Total Comments',  value: stats?.totalComments  || 0, color: '#e94560', delay: 0.3 },
          { label: 'Followers',       value: stats?.totalFollowers || 0, color: '#e94560', delay: 0.4 },
          { label: 'Following',       value: stats?.totalFollowing || 0, color: '#0f3460', delay: 0.5 },
          { label: 'Categories',      value: stats?.totalCategories|| 0, color: '#1a1a2e', delay: 0.6 },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-4 col-lg-2">
            <div
              className="card border-0 shadow rounded-4 text-center p-3 h-100"
              style={cardStyle(s.delay)}
            >
              <h6 className="text-muted small">{s.label}</h6>
              <p className="fs-4 fw-bold mb-0" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* My Posts */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold mb-0" style={{ color: '#1a1a2e' }}>My Posts</h5>
        <Link
          to="/create"
          className="btn btn-sm rounded-pill px-3 text-white"
          style={{ backgroundColor: '#e94560' }}
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-muted py-5">
          <p>You haven't written any posts yet.</p>
          <Link
            to="/create"
            className="btn rounded-pill px-4 text-white"
            style={{ backgroundColor: '#e94560' }}
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="d-grid gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card border-0 shadow-sm rounded-4 p-3"
              style={{ backgroundColor: '#f8f9ff' }}
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <span
                    className="badge rounded-pill me-2"
                    style={{ backgroundColor: '#e94560', fontSize: '0.7rem' }}
                  >
                    {post.category || 'General'}
                  </span>
                  <span className="fw-semibold" style={{ color: '#1a1a2e' }}>{post.title}</span>
                  <div className="d-flex gap-3 mt-1">
                    <small className="text-muted">👁 {post.views || 0} views</small>
                    <small className="text-muted">❤️ {post.likes || 0} likes</small>
                    <small className="text-muted">📅 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                    onClick={() => navigate(`/edit/${post.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}