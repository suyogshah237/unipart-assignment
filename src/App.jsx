import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Login from './components/Login';
import Directory from './components/Directory';
import AuthProvider from './contexts/AuthProvider.jsx';
import { useAuth } from './contexts/useAuth.js';

// Private route component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  return currentUser ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { currentUser } = useAuth();
  
  return (
    <Router>
      {/* Only show Navigation when user is authenticated */}
      {currentUser && <Navigation />}
      <div className="app-container">
        <Routes>
          <Route path="/login" element={
            <div className="auth-container">
              <Container className="py-5">
                <Row className="justify-content-center">
                  <Col xs={12} sm={10} md={8} lg={6}>
                    {currentUser ? <Navigate to="/" /> : <Login />}
                  </Col>
                </Row>
              </Container>
            </div>
          } />
          <Route path="/register" element={
            <div className="auth-container">
              <Container className="py-5">
                <Row className="justify-content-center">
                  <Col xs={12} sm={10} md={8} lg={6}>
                    {currentUser ? <Navigate to="/" /> : <Register />}
                  </Col>
                </Row>
              </Container>
            </div>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <Container fluid className="p-0">
                <Directory />
              </Container>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
