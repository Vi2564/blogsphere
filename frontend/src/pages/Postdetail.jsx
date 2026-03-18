import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080/api';

function getReadingTime(content) {
  const words = content?.trim().split(/\s+/).length || 0;
  const minutes = Math.ceil(words / 200);
  return minutes < 1 ? '< 1 min read' : `${minutes} min read`;
}

export default function PostDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost]             = useState(null);
  const [comments, setComments]     = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo]       = useState(null);
  const [replyText, setReplyText]   = useState('');
  const [loading, setLoading]       = useState(true);
  const [following, setFollowing]   = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [liked, setLiked]           = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/posts/${id}`).then((r) => r.json()),
      fetch(`${API_URL}/comments/post/${id}`).then((r) => r.json()),
    ])
      .then(([postData, commentData]) => {
        setPost(postData);
        setComments(commentData);

        // increment view
        fetch(`${API_URL}/posts/${id}/view`, { method: 'POST' });

        // check follow status
        if (user && postData.authorId && user.id !== postData.authorId) {
          fetch(`${API_URL}/follow/status/${user.id}/${postData.authorId}`)
            .then((r) => r.json())
            .then((d) => {
              setFollowing(d.following);
              setFollowerCount(d.followerCount);
            });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
    navigate('/');
  };

  const handleLike = async () => {
    if (liked) return;
    await fetch(`${API_URL}/posts/${id}/like`, { method: 'POST' });
    setPost((p) => ({ ...p, likes: (p.likes || 0) + 1 }));
    setLiked(true);
  };

  const handleFollow = async () => {
    if (!user) return navigate('/login');
    const res  = await fetch(`${API_URL}/follow/${user.id}/${post.authorId}`, { method: 'POST' });
    const data = await res.json();
    setFollowing(data.following);
    setFollowerCount(data.followerCount);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, authorId: user.id, content: newComment }),
      });
      const saved = await res.json();
      setComments((prev) => [...prev, saved]);
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id, authorId: user.id, content: replyText, parentId }),
      });
      const saved = await res.json();
      setComments((prev) => [...prev, saved]);
      setReplyTo(null);
      setReplyText('');
    } catch (err) { console.error(err); }
  };

  const shareOn = (platform) => {
    const text = encodeURIComponent(`Check out: ${post.title}`);
    const url  = encodeURIComponent(window.location.href);
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank');
  };

  if (loading) return <p className="text-center my-5 text-muted">Loading post...</p>;
  if (!post)   return <p className="text-center my-5 text-danger">Post not found.</p>;

  const isOwner    = user?.id === post.authorId;
  const topComments = comments.filter((c) => !c.parentId);
  const getReplies  = (parentId) => comments.filter((c) => c.parentId === parentId);

  return (
    <div className="container my-4 my-md-5 px-3 px-md-4" style={{ maxWidth: 750 }}>
      {/* Category + Meta */}
      <div className="mb-3">
        <span className="badge rounded-pill mb-2" style={{ backgroundColor: '#e94560' }}>
          {post.category || 'General'}
        </span>
        <h1 className="fw-bold" style={{ color: '#1a1a2e', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          {post.title}
        </h1>
        <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
          <small className="text-muted">By <strong>{post.authorName || 'Unknown'}</strong></small>
          <small className="text-muted">📅 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</small>
          <small className="text-muted">⏱ {getReadingTime(post.content)}</small>
          <small className="text-muted">👁 {post.views || 0} views</small>
        </div>
      </div>

      {/* Action Bar */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {/* Like */}
        <button
          className={`btn btn-sm rounded-pill px-3 ${liked ? 'btn-danger' : 'btn-outline-danger'}`}
          onClick={handleLike}
        >
          ❤️ {post.likes || 0}
        </button>

        {/* Follow (only show if not own post) */}
        {user && !isOwner && (
          <button
            className={`btn btn-sm rounded-pill px-3 ${following ? 'btn-secondary' : 'btn-outline-primary'}`}
            onClick={handleFollow}
          >
            {following ? '✅ Following' : '➕ Follow'} ({followerCount})
          </button>
        )}

        {/* Share buttons */}
        <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => shareOn('whatsapp')}>💬 WhatsApp</button>
        <button className="btn btn-sm btn-outline-info rounded-pill px-3"    onClick={() => shareOn('twitter')}>🐦 Twitter</button>
        <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => shareOn('linkedin')}>💼 LinkedIn</button>

        {/* Edit/Delete */}
        {isOwner && (
          <>
            <Link to={`/edit/${post.id}`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">Edit</Link>
            <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>

      <hr />

      {/* Content */}
      <div className="mb-5" style={{ lineHeight: 1.9, fontSize: '1.05rem', color: '#333' }}>
        {post.content?.split('\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>

      {/* Comments */}
      <div>
        <h5 className="fw-bold mb-3" style={{ color: '#1a1a2e' }}>
          💬 Comments ({comments.length})
        </h5>

        {topComments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first!</p>
        ) : (
          <div className="d-grid gap-3 mb-4">
            {topComments.map((c) => (
              <div key={c.id}>
                {/* Parent comment */}
                <div className="card border-0 shadow-sm rounded-3 p-3" style={{ backgroundColor: '#f8f9ff' }}>
                  <p className="mb-1" style={{ fontSize: '0.95rem' }}>{c.content}</p>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <small className="text-muted">— {c.authorName || 'Anonymous'}</small>
                    {user && (
                      <button
                        className="btn btn-sm btn-link p-0 text-muted"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                      >
                        💬 Reply
                      </button>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {getReplies(c.id).map((reply) => (
                  <div
                    key={reply.id}
                    className="card border-0 shadow-sm rounded-3 p-3 ms-4 mt-2"
                    style={{ backgroundColor: '#eef0ff' }}
                  >
                    <p className="mb-1" style={{ fontSize: '0.9rem' }}>{reply.content}</p>
                    <small className="text-muted">— {reply.authorName || 'Anonymous'}</small>
                  </div>
                ))}

                {/* Reply input */}
                {replyTo === c.id && (
                  <div className="d-flex gap-2 mt-2 ms-4">
                    <input
                      className="form-control form-control-sm rounded-pill px-3"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="btn btn-sm rounded-pill px-3 text-white"
                      style={{ backgroundColor: '#e94560', whiteSpace: 'nowrap' }}
                      onClick={() => handleReply(c.id)}
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        {user ? (
          <form onSubmit={handleAddComment} className="d-flex gap-2">
            <input
              className="form-control rounded-pill px-3"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn rounded-pill px-4 text-white"
              style={{ backgroundColor: '#e94560', whiteSpace: 'nowrap' }}
            >
              Post
            </button>
          </form>
        ) : (
          <p className="text-muted small">
            <Link to="/login" style={{ color: '#e94560' }}>Login</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}