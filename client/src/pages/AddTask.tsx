import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "High",
    status: "Pending",
    tags: {
      work: false,
      personal: false,
      urgent: false,
      important: false,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      tags: {
        ...formData.tags,
        [name]: checked,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Task data submitted:", formData);
    // Add task submission logic here
  };

  return (
    <Container fluid className="p-4 h-100">
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="mb-3">Add New Task</h2>
        <p className="text-muted mb-4">Create a new task to manage your work</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="taskTitle" className="">
              Task Title
            </Form.Label>
            <Form.Control
              type="text"
              size="lg"
              className="shadow-sm"
              id="taskTitle"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="taskDescription" className="fw-medium">
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              className="shadow-sm"
              id="taskDescription"
              name="description"
              rows={4}
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="dueDate">Due Date</Form.Label>
                <Form.Control
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="priority">Priority</Form.Label>
                <Form.Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="status">Status</Form.Label>
            <Form.Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
=            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Tags</Form.Label>
            <div>
              <Form.Check
                inline
                type="checkbox"
                id="tag-work"
                label="Work"
                name="work"
                checked={formData.tags.work}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                type="checkbox"
                id="tag-personal"
                label="Personal"
                name="personal"
                checked={formData.tags.personal}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                type="checkbox"
                id="tag-urgent"
                label="Urgent"
                name="urgent"
                checked={formData.tags.urgent}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                type="checkbox"
                id="tag-important"
                label="Important"
                name="important"
                checked={formData.tags.important}
                onChange={handleCheckboxChange}
              />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="light" className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Task
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default AddTask;
