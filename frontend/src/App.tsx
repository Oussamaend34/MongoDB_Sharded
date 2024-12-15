import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PostPage from './pages/PostPage';
import Logo from './assets/logo.png';

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex gap-4 text-xl">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/admin" className="hover:text-gray-300">Admin</Link>
          </div>
          <div> 
            <img src={Logo} alt="Logo" className="w-14"/>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;