import { Container, Navbar, Nav, Badge, Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../contexts/useAuth.js';

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
    };return (
        <Navbar bg="primary" variant="dark" expand="md" className="mb-0 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">Unipart App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">                    <Nav className="ms-auto">
                        {currentUser ? (
                            <>                                <Nav.Link className="text-light">
                                    {currentUser.displayName || currentUser.email}
                                    {userRole && (
                                        <Badge bg="light" text="primary" className="ms-1">
                                            {userRole}
                                        </Badge>
                                    )}                                </Nav.Link>                                <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    className="ms-2" 
                                    onClick={handleLogout}
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
