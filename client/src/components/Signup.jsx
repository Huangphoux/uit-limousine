import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signup() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your signup logic here
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <h3 className="text-center mb-4">Sign Up</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter name" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" required />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg">
                Sign Up
              </Button>
            </div>

            <div className="text-center mt-3">
              Already registered?{" "}
              <Link to="/login" className="text-decoration-none">
                Sign in
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
