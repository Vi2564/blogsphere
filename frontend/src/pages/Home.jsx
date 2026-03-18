import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

const API_URL = 'http://localhost:8080/api';

export default function Home() {
  const [posts, setPosts]         = useState([]);
  const [popular, setPopular]     = useState([]);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('latest');

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/posts`).then((r) => r.json()),
      fetch(`${API_URL}/posts/popular`).then((r) => r.json()),
    ])
      .then(([all, pop]) => {
        setPosts(all);
        setPopular(pop.slice(0, 3));
        const unique = [...new Set(all.map((p) => p.category).filter(Boolean))];
        setCategories(unique);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const displayPosts = tab === 'popular' ? popular : posts;

  const filtered = displayPosts.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? p.category === category : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="container my-4 my-md-5 px-3">
      {/* Hero */}
      <div
        className="rounded-4 p-4 p-md-5 mb-5 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}
      >
        <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
          Welcome to <span style={{ color: '#e94560' }}>BlogSphere</span>
        </h1>
        <p className="text-white-50 mb-4">
          Discover stories, ideas, and perspectives from writers around the world.
        </p>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 420 }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn btn-sm rounded-pill px-4 ${tab === 'latest' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setTab('latest')}
        >
          🕐 Latest
        </button>
        <button
          className={`btn btn-sm rounded-pill px-4 ${tab === 'popular' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setTab('popular')}
        >
          🔥 Popular
        </button>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button
            className={`btn btn-sm rounded-pill px-3 ${category === '' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setCategory('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-3 ${category === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <p className="text-center text-muted mt-5">Loading posts...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted mt-5">No posts found.</p>
      ) : (
        <div className="row g-4">
          {filtered.map((post) => (
            <div key={post.id} className="col-12 col-sm-6 col-lg-4">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}