import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../components/Header";

const NewPageLayout = () => {
  return (
    <>
      <Header />
      <Container className="mt-5 pt-5">
        <Outlet />
      </Container>
    </>
  );
};

export default NewPageLayout;
