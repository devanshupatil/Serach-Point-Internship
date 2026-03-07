import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryView from './pages/CategoryView';

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/category/:type" element={<CategoryView />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
