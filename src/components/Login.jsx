import { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import GoogleSignIn from './GoogleSignIn';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Login successful - will be handled by the auth context
    } catch (err) {
      let errorMessage = 'Failed to log in. Please check your credentials.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };  return (
    <Container>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <img 
                src="/logo.png" 
                alt="Unipart Logo" 
                className="mb-3" 
                style={{ maxWidth: '150px', height: 'auto' }} 
              />
              <h3 className="mb-4">Login</h3>
            </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="danger" 
                    type="submit" 
                    disabled={loading}
                    className="py-2"
                    style={{ backgroundColor: '#d72626', borderColor: '#d72626' }}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
                
                <div className="text-center mt-3 mb-3">
                  <p className="mb-0">OR</p>
                </div>                <div className="d-grid">
                  <GoogleSignIn 
                    onLoading={setLoadingState} 
                    setError={setError} 
                    buttonText="Sign in with Google" 
                    disabled={loading}
                  />
                </div>
                
                <div className="text-center mt-3">
                  <p>Don't have an account? <Link to="/register" style={{ color: '#18348B' }}>Register</Link></p>
                </div>
              </Form>
            </Card.Body>
          </Card>
    </Container>
  );
};

export default Login;
