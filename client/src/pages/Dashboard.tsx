import { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Task type definition
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'To Do' | 'In Progress';
}

const Dashboard = () => {
  const navigate = useNavigate();
  // Sample mock tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Draft and finalize the project proposal for the client meeting',
      dueDate: '5/20/2024',
      priority: 'High',
      status: 'Completed'
    },
    {
      id: '2',
      title: 'Update documentation',
      description: 'Update the API documentation with new endpoints',
      dueDate: '5/15/2024',
      priority: 'Low',
      status: 'Completed'
    },
    {
      id: '3',
      title: 'Backend development',
      description: 'Develop the backend API for user authentication',
      dueDate: '5/25/2024',
      priority: 'High',
      status: 'In Progress'
    },
    {
      id: '4',
      title: 'Frontend UI design',
      description: 'Create mockups for the new dashboard interface',
      dueDate: '5/18/2024',
      priority: 'Medium',
      status: 'To Do'
    }
  ]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count tasks by status
  const completedCount = tasks.filter(task => task.status === 'Completed').length;
  const inProgressCount = tasks.filter(task => task.status === 'In Progress').length;
  const pendingCount = tasks.filter(task => task.status === 'To Do').length;
  const totalCount = tasks.length;

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: 'Completed' | 'To Do' | 'In Progress') => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">My Tasks</h1>
          <p className="text-muted mb-0">Manage your tasks efficiently</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center rounded-pill"
          onClick={() => window.location.href = '/add-task'}
        >
          <i className="bi bi-plus-lg me-1"></i> Add New Task
        </Button>
      </div>

      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <Row className="align-items-center">
          <Col md={5}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-start-0 ps-0"
                style={{ boxShadow: 'none' }}
              />
            </InputGroup>
          </Col>
          <Col md={7} className="mt-3 mt-md-0">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              <Button variant="primary" size="sm" className="rounded-pill">
                All Tasks ({totalCount})
              </Button>
              <Button variant="outline-primary" size="sm" className="rounded-pill">
                In Progress ({inProgressCount})
              </Button>
              <Button variant="outline-primary" size="sm" className="rounded-pill">
                Completed ({completedCount})
              </Button>
              <Button variant="outline-primary" size="sm" className="rounded-pill">
                Pending ({pendingCount})
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Task cards */}
      <Row>
        {filteredTasks.map((task) => (
          <Col md={6} lg={4} key={task.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0 task-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <Badge 
                    bg={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}
                    className="mb-2 rounded-pill"
                  >
                    {task.priority}
                  </Badge>
                  <div className="d-flex">
                    <Button variant="link" className="p-0 me-2 text-secondary">
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button variant="link" className="p-0 text-secondary">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
                
                <Card.Title className="mb-2">{task.title}</Card.Title>
                <Card.Text className="text-muted mb-3 small">{task.description}</Card.Text>
                
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <div>
                    <small className="text-muted d-flex align-items-center">
                      <i className="bi bi-calendar me-1"></i> Due: {task.dueDate}
                    </small>
                  </div>
                  
                  <Form.Select 
                    size="sm" 
                    style={{ width: 'auto' }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(
                      task.id, 
                      e.target.value as 'Completed' | 'To Do' | 'In Progress'
                    )}
                    className={`status-dropdown ${
                      task.status === 'Completed' ? 'completed' : 
                      task.status === 'In Progress' ? 'in-progress' : 'to-do'
                    }`}
                  >
                    <option value="Completed">Completed</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                  </Form.Select>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {filteredTasks.length === 0 && (
          <Col xs={12}>
            <div className="text-center p-5 bg-white rounded shadow-sm">
              <h4>No tasks found</h4>
              <p className="text-muted">Try adjusting your search or add new tasks</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
