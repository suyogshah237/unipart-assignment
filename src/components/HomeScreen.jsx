import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/useAuth.js';

const HomeScreen = () => {
  const { currentUser } = useAuth();

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-5 text-center">
              <div className="mb-4">
                <span className="display-6 text-primary">👋</span>
              </div>
              <h2 className="mb-3">Welcome, {currentUser?.displayName || currentUser?.email}!</h2>
              <p className="lead text-muted mb-4">
                You have successfully registered and logged in to the application.
              </p>
              <div className="d-flex justify-content-center">
                <Button variant="outline-primary" className="px-4">
                  Continue to Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;
