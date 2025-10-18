
import { Container, Navbar } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Retrieve user information from localStorage
    let userData = localStorage.getItem("user");

    // DEBUG MODE: If no user data exists, create fake data for debugging
    if (!userData) {
      const fakeUser = {
        username: "admin",
        email: "admin@example.com",
      };
      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUserInfo(fakeUser);
    } else {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  if (!userInfo) {
    return (
      <>
        <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>Limousine!</Navbar.Brand>
          </Container>
        </Navbar>
        <Container className="mt-5 pt-5">Loading...</Container>
      </>
    );
  }

  return (
    <>
      {/* Custom header with only the app name */}
      <Navbar expand="lg" fixed="top" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Limousine!</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main content */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", paddingTop: "80px" }}
      >
        <div className="text-center">
          <h2>{userInfo.username}</h2>
          <p>{userInfo.email}</p>
        </div>
      </Container>
    </>
  );
}
