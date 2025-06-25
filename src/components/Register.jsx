import { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import GoogleSignIn from './GoogleSignIn';

const Register = () => {    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const setLoadingState = (isLoading) => {
        setLoading(isLoading);
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!formData.password) return 'Password is required';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        return null;
    };    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setError('');
            setLoading(true);
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Update the user's display name
            await updateProfile(userCredential.user, {
                displayName: formData.name
            });

            // Create a user document in Firestore
            await setDoc(doc(firestore, 'users', userCredential.user.uid), {
                name: formData.name,
                email: formData.email,
                uid: userCredential.user.uid,
                role: 'USER',
                createdOn: serverTimestamp()
            });

            setSuccess(true);
            // Redirect to home after successful registration
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            let errorMessage = 'Failed to register. Please try again.';

            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email is already in use';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };    return (
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
                        <h3 className="mb-3">Register</h3>
                    </div>
                    <p className="text-center mb-4">
                        Already have an account? <Link to="/login" style={{ color: '#18348B' }}>Login</Link>
                    </p>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Registration successful!</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password (min. 6 characters)"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">                            <Button
                                variant="danger"
                                type="submit"
                                disabled={loading}
                                className="py-2"
                                style={{ backgroundColor: '#d72626', borderColor: '#d72626' }}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </div>
                        
                        <div className="text-center mt-3 mb-3">
                            <p className="mb-0">OR</p>
                        </div>
                        
                        <div className="d-grid">
                            <GoogleSignIn 
                                onLoading={setLoadingState} 
                                setError={setError} 
                                buttonText="Sign up with Google" 
                                disabled={loading}
                            />
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
