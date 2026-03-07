import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SharePage from './pages/SharePage';

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/share" element={<SharePage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
