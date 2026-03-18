import { Routes, Route } from 'react-router-dom';

import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Signup    from './pages/Signup';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Dashboard  from './pages/Dashboard';
import EditPost   from './pages/EditPost';
import Bookmarks  from './pages/Bookmarks';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/signup"   element={<Signup />} />
            <Route path="/post/:id" element={<PostDetail />} />

            <Route path="/create"    element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/edit/:id"  element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}