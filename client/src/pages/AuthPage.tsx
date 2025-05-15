import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Tab,
  Nav,
} from "react-bootstrap";
import { useState } from "react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <Container
      fluid
      className="auth-page vh-100 d-flex align-items-center justify-content-center"
    >
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Tab.Container
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "login")}
              >
                <Nav variant="pills" className="mb-4 nav-justified">
                  <Nav.Item>
                    <Nav.Link eventKey="login" className="rounded-pill">
                      Login
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="register" className="rounded-pill">
                      Register
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="login">
                    <h4 className="mb-4">Welcome Back</h4>
                    <p className="text-muted mb-4">
                      Enter your credentials to access your account
                    </p>

                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="you@example.com"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="********" />
                      </Form.Group>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <Form.Check
                          type="checkbox"
                          id="remember-me"
                          label="Remember me"
                        />
                        <a href="#" className="text-decoration-none">
                          Forgot password?
                        </a>
                      </div>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2"
                      >
                        Sign in
                      </Button>
                    </Form>
                  </Tab.Pane>

                  <Tab.Pane eventKey="register">
                    <h4 className="mb-4">Create Account</h4>
                    <p className="text-muted mb-4">
                      Register to get started with TaskManager
                    </p>

                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="you@example.com"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="********" />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          id="terms"
                          label="I agree to the Terms & Conditions"
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2"
                      >
                        Create Account
                      </Button>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
