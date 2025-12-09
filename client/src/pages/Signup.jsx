import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("API_URL:", API_URL);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Signup failed");
      }

      // Show success message if available
      if (data.message) {
        console.log(data.message);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      // You might want to show this error to the user in the UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <h3 className="text-center mb-4">Sign Up</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    <span className="visually-hidden">Signing up...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
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
