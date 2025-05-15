import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FC } from 'react';

const Sidebar: FC = () => {
  return (
    <div className="sidebar-wrapper py-3">
      <div className="sidebar-header px-3 mb-4">
        <h3 className="text-primary">TaskManager</h3>
      </div>
      
      <Nav className="flex-column">
        <Nav.Item>
          <NavLink to="/" className={({isActive}) => 
            `nav-link d-flex align-items-center px-3 py-2 ${isActive ? 'active' : ''}`
          }>
            <i className="bi bi-house-door me-2"></i>
            Dashboard
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/add-task" className={({isActive}) => 
            `nav-link d-flex align-items-center px-3 py-2 ${isActive ? 'active' : ''}`
          }>
            <i className="bi bi-plus-circle me-2"></i>
            Add Task
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/edit-task" className={({isActive}) => 
            `nav-link d-flex align-items-center px-3 py-2 ${isActive ? 'active' : ''}`
          }>
            <i className="bi bi-pencil-square me-2"></i>
            Edit Task
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/profile" className={({isActive}) => 
            `nav-link d-flex align-items-center px-3 py-2 ${isActive ? 'active' : ''}`
          }>
            <i className="bi bi-person me-2"></i>
            Profile
          </NavLink>
        </Nav.Item>
        
       
      </Nav>
      
      <div className="sidebar-footer mt-auto px-3 py-3">
        <div className="user-info d-flex align-items-center">
          <div className="user-avatar bg-primary text-white d-flex align-items-center justify-content-center rounded-circle">
            JD
          </div>
          <div className="ms-2">
            <p className="mb-0 fw-medium">John Doe</p>
            <small className="text-muted">john@example.com</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
