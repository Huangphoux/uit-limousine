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
      <>
        <style>{`
          .auth-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 0;
          }

          .auth-card {
            background: white;
            border-radius: 1.5rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            padding: 3rem 2.5rem;
            max-width: 480px;
            width: 100%;
          }
        `}</style>
        <div className="auth-container">
          <div className="auth-card">
            <Alert variant="success" className="text-center mb-0">
              <Alert.Heading>Password Reset Successful!</Alert.Heading>
              <p>
                Your password has been successfully reset. You will be redirected to the login page
                in a few seconds.
              </p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
        }

        .auth-card {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 100%;
        }

        .auth-title {
          color: #1a1a1a;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .auth-subtitle {
          color: #6c757d;
          font-size: 0.95rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-label {
          color: #1a1a1a;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .auth-input {
          border: 2px solid #e9ecef;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa !important;
          color: #212529 !important;
        }

        .auth-input:focus {
          background: white !important;
          border-color: #007bff;
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
          color: #212529 !important;
        }

        .auth-input::placeholder {
          color: #adb5bd !important;
        }

        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus,
        .auth-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #f8f9fa inset !important;
          -webkit-text-fill-color: #212529 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .auth-button {
          border-radius: 0.75rem;
          padding: 0.875rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          border: none;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
        }

        .auth-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-link {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .auth-help-text {
          color: #6c757d;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 576px) {
          .auth-card {
            padding: 2rem 1.5rem;
            border-radius: 1rem;
          }
          
          .auth-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password below.</p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label className="auth-label">New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="auth-input"
              />
              <Form.Text className="auth-help-text">
                Password must be at least 6 characters long.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label className="auth-label">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={!!passwordError}
                className="auth-input"
              />
              <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
              <Button className="auth-button" type="submit" size="lg" disabled={isLoading}>
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
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              <Link to="/login" className="auth-link">
                Back to Sign In
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
