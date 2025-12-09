import { Form, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  // handleChange: update input field values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handleSubmit: process data when the user clicks reset button
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Forgot password request for:", formData.email);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Request failed");
      }

      // Show success message
      setShowSuccess(true);

      // Reset form
      setFormData({ email: "" });
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("fetch")) {
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        alert("Request failed: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center w-100">
        <Col xs={12} md={6} lg={5}>
          <h3 className="text-center mb-4">Forgot Password</h3>
          <p className="text-center text-muted mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {showSuccess && (
            <Alert variant="success" className="mb-4">
              <Alert.Heading>Email Sent!</Alert.Heading>
              <p>
                We've sent a password reset link to your email address. Please check your inbox and
                follow the instructions to reset your password.
              </p>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
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
                    <span className="visually-hidden">Sending...</span>
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none">
                Back to Sign In
              </Link>
            </div>

            <div className="text-center mt-2">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-decoration-none">
                Sign up
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
