import { Container, Navbar, Nav, Badge, Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../contexts/useAuth.js';
import '../styles/Navigation.css';

const Navigation = () => {
    const { currentUser, userRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (
        <Navbar 
            style={{ backgroundColor: '#7485a9' }} 
            variant="dark" 
            expand="md" 
            className="mb-0 shadow-sm navbar-custom"
        >
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/logo.png"
                        alt="Unipart Logo"
                        height="30"
                        className="d-inline-block align-top me-2"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto mobile-nav-center">
                        {currentUser ? (
                            <>
                                <Nav.Link className="text-light mobile-user-info">
                                    {currentUser.displayName || currentUser.email}
                                    {userRole && (
                                        <Badge bg="light" text="primary" className="ms-1 mobile-badge">
                                            {userRole}
                                        </Badge>
                                    )}                                
                                    </Nav.Link>                                
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        className="ms-2 mobile-logout-btn"
                                        onClick={handleLogout}
                                        style={{ 
                                            borderColor: '#ffffff',
                                            color: '#ffffff',
                                            transition: 'background-color 0.3s, color 0.3s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#d72626';
                                            e.currentTarget.style.borderColor = '#d72626';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderColor = '#ffffff';
                                        }}
                                    >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <></>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
