import { Link } from "react-router";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const ErrorPage = () => {
  return (
    <Container className="d-flex vh-100 align-items-center justify-content-center">
      <div className="text-center">
        <h1>Oh no, this route doesn't exist!</h1>
        <p>You can go back to the home page by clicking the button below.</p>

        <Button as={Link} to="/">
          Home
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPage;
