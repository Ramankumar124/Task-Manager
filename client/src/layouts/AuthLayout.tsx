import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

const AuthLayout:React.FC = () => {
  return (
    <Container fluid className="auth-container p-0">
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
