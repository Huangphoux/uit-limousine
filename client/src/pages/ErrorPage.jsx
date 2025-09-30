import { Link } from "react-router";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const ErrorPage = () => {
  return (
    <Container>
      <h1>Oh no, this route doesn't exist!</h1>
      <p>You can go back to the home page by clicking the button below.</p>
      <Button as={Link} to="/">Home</Button>
    </Container>
  );
};

export default ErrorPage;
