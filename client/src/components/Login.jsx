import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "test@test.com", // Dữ liệu có sẵn để khỏi phải nhập thủ công
    password: "test123", // Dữ liệu có sẵn để khỏi phải nhập thủ công
  });

  // handleChange: đặt dữ liệu vào miền tương ứng
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handleSubmit: xử lí dữ liệu khi người dùng bấm vào nút với API Render
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Loading: Hiện Spinner trên nút Login

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Lưu thông tin user và token vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate: chuyển hướng sang trang hiện thông tin người dùng
      navigate("/user-info");
    } catch (error) {
      console.error("Error:", error);
      if (error.message.includes("fetch")) {
        alert("Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.");
      } else {
        alert("Đăng nhập thất bại: " + error.message);
      }
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <h3 className="text-center mb-4">Sign In</h3>

          <Form onSubmit={handleSubmit}>
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

            <Form.Group className="mb-3" controlId="formRememberMe">
              <Form.Check type="checkbox" label="Remember me" />
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
                    <span className="visually-hidden">Đang đăng nhập...</span>
                    Đang đăng nhập...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot password?
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
