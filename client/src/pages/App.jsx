import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

const App = () => {
  return (
    <>
      <style>
        {`
            .bg-body-tertiary {
              background: white !important;
              color: black !important;
              border-bottom: 2px solid #d9d9d9 !important;
            }
            .bg-body-tertiary .navbar-brand {
              color: black !important;
              font-size: 1.4rem;
              font-weight: bold;
            }
            .bg-body-tertiary .nav-link {
              color: black !important;
            }
          `}
      </style>
      <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Limousine !
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Item>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link as={Link} to="/sign-up">
                  Sign up
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5 pt-5">
        <Outlet />
      </Container>
    </>
  );
};

export default App;
