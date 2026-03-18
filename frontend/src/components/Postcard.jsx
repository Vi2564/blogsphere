import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Reading time calculator
function getReadingTime(content) {
  const words = content?.trim().split(/\s+/).length || 0;
  const minutes = Math.ceil(words / 200);
  return minutes < 1 ? '< 1 min read' : `${minutes} min read`;
}

export default function PostCard({ post }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const excerpt =
    post.content?.length > 120
      ? post.content.substring(0, 120) + '...'
      : post.content;

  const readingTime = getReadingTime(post.content);
  const postUrl = `${window.location.origin}/post/${post.id}`;

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(bookmarks.includes(post.id));
  }, [post.id]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let updated;
    if (bookmarked) {
      updated = bookmarks.filter((id) => id !== post.id);
    } else {
      updated = [...bookmarks, post.id];
    }
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  const shareOn = (platform) => {
    const text = encodeURIComponent(`Check out this post: ${post.title}`);
    const url  = encodeURIComponent(postUrl);
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank');
    setShowShare(false);
  };

  return (
    <div
      className="card border-0 shadow-sm rounded-4 h-100 position-relative"
      style={{
        backgroundColor: '#fff',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="card-body p-3 p-md-4">
        {/* Category + Bookmark */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: '#e94560', fontSize: '0.75rem' }}
          >
            {post.category || 'General'}
          </span>
          <button
            onClick={toggleBookmark}
            className="btn btn-sm p-0 border-0"
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            style={{ background: 'none', fontSize: '1.1rem' }}
          >
            {bookmarked ? '🔖' : '📄'}
          </button>
        </div>

        {/* Title */}
        <h5 className="fw-bold mb-2" style={{ color: '#1a1a2e', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
          {post.title}
        </h5>

        {/* Excerpt */}
        <p className="text-muted small mb-2">{excerpt}</p>

        {/* Reading time + Views */}
        <div className="d-flex gap-3 mb-3">
          <small className="text-muted">⏱ {readingTime}</small>
          {post.views > 0 && (
            <small className="text-muted">👁 {post.views} views</small>
          )}
        </div>

        {/* Author + Actions */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <small className="text-muted">
            By <strong>{post.authorName || 'Unknown'}</strong>
          </small>

          <div className="d-flex gap-2 align-items-center position-relative">
            {/* Share Button */}
            <div className="position-relative">
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                style={{ fontSize: '0.75rem' }}
                onClick={(e) => { e.preventDefault(); setShowShare(!showShare); }}
              >
                🔗 Share
              </button>

              {showShare && (
                <div
                  className="position-absolute bg-white shadow rounded-3 p-2"
                  style={{ bottom: '110%', right: 0, zIndex: 100, minWidth: '130px' }}
                >
                  <button
                    className="btn btn-sm w-100 text-start mb-1"
                    style={{ color: '#25D366', fontSize: '0.8rem' }}
                    onClick={() => shareOn('whatsapp')}
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    className="btn btn-sm w-100 text-start mb-1"
                    style={{ color: '#1DA1F2', fontSize: '0.8rem' }}
                    onClick={() => shareOn('twitter')}
                  >
                    🐦 Twitter
                  </button>
                  <button
                    className="btn btn-sm w-100 text-start"
                    style={{ color: '#0A66C2', fontSize: '0.8rem' }}
                    onClick={() => shareOn('linkedin')}
                  >
                    💼 LinkedIn
                  </button>
                </div>
              )}
            </div>

            {/* Read Button */}
            <Link
              to={`/post/${post.id}`}
              className="btn btn-sm rounded-pill px-3"
              style={{ backgroundColor: '#1a1a2e', color: '#fff', fontSize: '0.8rem' }}
            >
              Read →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}