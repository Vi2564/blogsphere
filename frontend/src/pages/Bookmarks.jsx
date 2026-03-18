import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

const API_URL = 'http://localhost:8080/api';

export default function Bookmarks() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookmarkIds = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (bookmarkIds.length === 0) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/posts`)
      .then((r) => r.json())
      .then((all) => {
        const saved = all.filter((p) => bookmarkIds.includes(p.id));
        setPosts(saved);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>
        🔖 My Bookmarks
      </h3>

      {loading ? (
        <p className="text-muted text-center mt-5">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p style={{ fontSize: '3rem' }}>📄</p>
          <p>No bookmarks yet. Click the 📄 icon on any post to save it here.</p>
        </div>
      ) : (
        <div className="row g-4">
          {posts.map((post) => (
            <div key={post.id} className="col-md-4 col-sm-6">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}