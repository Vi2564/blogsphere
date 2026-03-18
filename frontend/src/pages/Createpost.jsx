import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL   = 'http://localhost:8080/api';
const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Finance', 'Other'];

export default function CreatePost() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]     = useState({ title: '', category: '', content: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.content) {
      return setError('Title and content are required.');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, authorId: user.id }),
      });

      if (!res.ok) throw new Error('Failed to create post.');

      const created = await res.json();
      navigate(`/post/${created.id}`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 700 }}>
      <h3 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>
        ✍️ Write a New Post
      </h3>

      {error && (
        <div
          className="alert rounded-3 py-2"
          style={{ backgroundColor: '#f3dcdc', color: '#842029' }}
        >
          {error}
        </div>
      )}

      <div
        className="card border-0 shadow rounded-4 p-4"
        style={{ backgroundColor: '#f8f9ff' }}
      >
        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div>
            <label className="form-label fw-semibold">Post Title</label>
            <input
              className="form-control rounded-3 px-3"
              placeholder="Enter a catchy title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select rounded-3"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label fw-semibold">Content</label>
            <textarea
              className="form-control rounded-3 px-3"
              placeholder="Write your story here..."
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn rounded-pill px-4 text-white"
              disabled={loading}
              style={{ backgroundColor: '#e94560' }}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}