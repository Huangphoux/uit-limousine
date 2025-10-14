import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useState } from "react";

const NewPageLayout = () => {
  const navigate = useNavigate();
  const [userEmail] = useState("user@example.com");

  const handleSignOut = () => {
    //handle Sign Out here...
    navigate("/");
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Limousine !
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title={userEmail} id="user-dropdown" align="end">
                <NavDropdown.Item>Item 1</NavDropdown.Item>
                <NavDropdown.Item>Item 2</NavDropdown.Item>
                <NavDropdown.Item>Item 3</NavDropdown.Item>
                <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
              </NavDropdown>
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

export default NewPageLayout;
