import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import TrashPage from './pages/TrashPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/home" element={token ? <Home /> : <Navigate to="/login" replace />} />
      <Route path="/category/:type" element={token ? <CategoryView /> : <Navigate to="/login" replace />} />
      <Route path="/trash" element={token ? <TrashPage /> : <Navigate to="/login" replace />} />
      <Route path="/search" element={token ? <SearchPage /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
