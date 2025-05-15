import { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EditTask = () => {
  const navigate = useNavigate();
  // State for form data
  const [formData, setFormData] = useState({
    title: "Complete project documentation",
    description:
      "Finish writing the technical documentation for the project including API endpoints, database schema, and deployment instructions.",
    dueDate: "2023-05-20",
    priority: "High",
    status: "In Progress",
    tags: ["Work", "Urgent", "Important"],
  });

  // Available tags
  const availableTags = ["Work", "Personal", "Urgent", "Important"];

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for tags
  const handleTagChange = (tag: string) => {
    setFormData((prev) => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the API call to update the task
    console.log("Updated task:", formData);
    alert("Task updated successfully!");
    navigate("/");
  };

  // Handle task deletion
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      // Here you would implement the API call to delete the task
      console.log("Deleted task");
      alert("Task deleted successfully!");
      navigate("/");
    }
  };

  return (
    <Container fluid className="p-4 bg-light h-100">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="mb-2">Edit Task</h2>
          <p className="text-muted mb-4">Update your task details</p>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="taskTitle">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow-sm"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="taskDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="dueDate">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="shadow-sm"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12} className="mb-3">
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow-sm"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12} className="mb-4">
                <Form.Label>Tags</Form.Label>
                <div className="d-flex flex-wrap gap-3">
                  {availableTags.map((tag) => (
                    <Form.Check
                      key={tag}
                      type="checkbox"
                      id={`tag-${tag}`}
                      label={tag}
                      checked={formData.tags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                      className="user-select-none"
                    />
                  ))}
                </div>
              </Col>

              <Col xs={12} className="d-flex justify-content-between">
                <Button
                  variant="danger"
                  type="button"
                  onClick={handleDelete}
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-trash me-2"></i> Delete Task
                </Button>

                <div>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate("/")}
                    className="me-2"
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Update Task
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditTask;
