import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <Container>
      <h1>Page 1</h1>
      <Button as={Link} to="/profile">Profile</Button>
    </Container>
  );
};

export default App;
