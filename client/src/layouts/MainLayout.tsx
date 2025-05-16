import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Row, Col } from "react-bootstrap";
import type React from "react";

const MainLayout:React.FC = () => {
  return (
    <div className="d-flex flex-column vh-100">
      <Row className="g-0 flex-grow-1 overflow-hidden">
        <Col md={3} lg={2} className="sidebar">
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="main-content">
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default MainLayout;
