export default function Footer() {
  return (
    <footer
      className="text-center py-3 mt-auto"
      style={{ backgroundColor: '#1a1a2e', color: '#aaa', fontSize: '0.85rem' }}
    >
      © {new Date().getFullYear()} BlogSphere — Write. Share. Inspire.
    </footer>
  );
}