import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    setError(""); // Xóa lỗi khi user nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    console.log("API_URL:", API_URL);
    setIsLoading(true);
    setError("");

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
        // Hiển thị lỗi chi tiết từ backend
        let errorMessage = "Đăng ký thất bại!";
        
        if (data.error?.message) {
          errorMessage = data.error.message;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        // Thêm thông tin chi tiết nếu có
        if (data.error?.details) {
          errorMessage += `: ${data.error.details}`;
        }
        
        setError(errorMessage);
        return;
      }

      // Show success message if available
      if (data.message) {
        console.log(data.message);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      setError("Lỗi kết nối. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

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

        .auth-divider {
          color: #6c757d;
          font-size: 0.9rem;
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to get started</p>

          {error && (
            <div style={{
              padding: "12px 16px",
              marginBottom: "20px",
              backgroundColor: "#fee",
              color: "#c00",
              border: "1px solid #fcc",
              borderRadius: "0.75rem",
              fontSize: "0.95rem"
            }}>
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="auth-label">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="auth-label">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="auth-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
              />
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

            <div className="text-center mt-4 auth-divider">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
