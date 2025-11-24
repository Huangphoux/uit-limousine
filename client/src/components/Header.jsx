import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown, Button, Badge } from "react-bootstrap";
import { FaBell } from "react-icons/fa";

const Header = ({ unreadCount, onBellClick }) => {
  const navigate = useNavigate();
  const [userEmail] = useState("user@example.com"); // This can be replaced with actual user data

  const handleSignOut = () => {
    //handle Sign Out here...
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          .navbar .dropdown-menu,
          #user-dropdown + .dropdown-menu,
          .dropdown-menu.show {
            border: none !important;
            border-left: 1px solid #ddd !important;
            border-right: 1px solid #ddd !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            border-radius: 0 !important;
            background-color: #EFF6FF !important;
          }
          .navbar .dropdown-menu::before,
          .navbar .dropdown-menu::after {
            content: none !important;
            display: none !important;
          }
          .dropdown-item:hover,
          .dropdown-item:focus {
            background-color: rgba(0,0,0,0.05) !important;
            color: #000 !important;
          }
          .notification-bell {
            position: relative;
            cursor: pointer;
            color: #000;
            font-size: 1.25rem;
          }
          .notification-badge {
            position: absolute;
            top: -5px;
            right: -10px;
            padding: 2px 6px;
            border-radius: 50%;
            background: #dc3545;
            color: white;
            font-size: 0.7rem;
            font-weight: bold;
            border: 2px solid #EFF6FF;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 20px;
          }
        `}
      </style>
      <Navbar
        expand="lg"
        fixed="top"
        className="navbar-light"
        style={{ color: "#000", backgroundColor: "#EFF6FF", borderBottom: "1px solid #ddd" }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ color: "#000" }}>
            Limousine !
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: "#000" }} />

          <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: "#EFF6FF" }}>
            <Nav className="ms-auto">
              <Nav.Item className="d-flex align-items-center me-3">
                <div className="notification-bell" onClick={onBellClick}>
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </div>
              </Nav.Item>
              <NavDropdown
                title={<span style={{ color: "#000" }}>{userEmail}</span>}
                id="user-dropdown"
                align="end"
                menuVariant="light"
              >
                <NavDropdown.Item style={{ color: "#000", backgroundColor: "#EFF6FF" }}>
                  Item 1
                </NavDropdown.Item>
                <NavDropdown.Item style={{ color: "#000", backgroundColor: "#EFF6FF" }}>
                  Item 2
                </NavDropdown.Item>
                <NavDropdown.Item style={{ color: "#000", backgroundColor: "#EFF6FF" }}>
                  Item 3
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={handleSignOut}
                  style={{ color: "#000", backgroundColor: "#EFF6FF" }}
                >
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
