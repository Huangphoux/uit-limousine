import { Form, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Check if token exists
  useEffect(() => {
    if (!token) {
      alert("Invalid or missing reset token. Please request a new password reset.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  // handleChange: update input field values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear password error when user types
    if (passwordError) {
      setPasswordError("");
    }
  };

  // Validate passwords match
  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  // handleSubmit: process data when the user clicks change password button
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!validatePasswords()) {
      return;
    }

    console.log("Reset password request with token:", token);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Reset failed");
      }

      // Show success message
      setShowSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("fetch")) {
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        alert("Password reset failed: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Container fluid className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
        <Row className="justify-content-center w-100">
          <Col xs={12} md={6} lg={5}>
            <Alert variant="success" className="text-center">
              <Alert.Heading>Password Reset Successful!</Alert.Heading>
              <p>
                Your password has been successfully reset. You will be redirected to the login page
                in a few seconds.
              </p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="d-flex align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center w-100">
        <Col xs={12} md={6} lg={5}>
          <h3 className="text-center mb-4">Reset Password</h3>
          <p className="text-center text-muted mb-4">Enter your new password below.</p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={!!passwordError}
              />
              <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
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
                    <span className="visually-hidden">Changing...</span>
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none">
                Back to Sign In
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
