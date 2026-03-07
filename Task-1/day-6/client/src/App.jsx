import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';
import TrashPage from './pages/TrashPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/category/:type" element={<CategoryView />} />
      <Route path="/trash" element={<TrashPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
