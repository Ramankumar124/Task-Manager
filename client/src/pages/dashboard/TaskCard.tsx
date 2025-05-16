import type { Task } from "@/types/taskTypes";
import { Badge, Button, Card, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface TaskcardProps {
  task: Task;

  isUpdating: boolean;
}
interface TaskcardProps {
  task: Task;
  handleDeleteClick: (taskId: string) => void;
  handleStatusChange: (
    taskId: string,
    status: "Completed" | "To Do" | "In Progress"
  ) => void;
  isUpdating: boolean;
}

const TaskCard = ({
  task,
  handleDeleteClick,
  handleStatusChange,
  isUpdating,
}: TaskcardProps) => {
  const navigate = useNavigate();
  return (
    <Col md={6} lg={4} key={task._id} className="mb-4">
      <Card className="h-100 shadow-sm border-0 task-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <Badge
              bg={
                task.priority === "High"
                  ? "danger"
                  : task.priority === "Medium"
                  ? "warning"
                  : "success"
              }
              className="mb-2 rounded-pill"
            >
              {task.priority}
            </Badge>
            <div className="d-flex">
              <Button
                variant="link"
                className="p-0 me-2 text-secondary"
                onClick={() => navigate(`/edit-task/${task._id}`)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="link"
                className="p-0 text-secondary"
                onClick={() => handleDeleteClick(task._id)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </div>

          <Card.Title className="mb-2">{task.title}</Card.Title>
          <Card.Text className="text-muted mb-3 small">
            {task.description}
          </Card.Text>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div>
              <small className="text-muted d-flex align-items-center">
                <i className="bi bi-calendar me-1"></i> Due:{" "}
                {new Date(task.dueDate).toISOString().split("T")[0]}
              </small>
            </div>

            <Form.Select
              size="sm"
              style={{ width: "auto" }}
              value={task.status}
              onChange={(e) =>
                handleStatusChange(
                  task._id,
                  e.target.value as "Completed" | "To Do" | "In Progress"
                )
              }
              className={`status-dropdown ${
                task.status === "Completed"
                  ? "completed"
                  : task.status === "In Progress"
                  ? "in-progress"
                  : "to-do"
              }`}
              disabled={isUpdating}
            >
              <option value="Completed">Completed</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
            </Form.Select>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TaskCard;
