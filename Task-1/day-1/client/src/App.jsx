import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const App = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={token ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={token ? <Navigate to="/home" replace /> : <Signup />} 
      />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={token ? "/home" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

export default App;
