import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/redux/api/tasksApi";
import type { Task } from "@/types/taskTypes";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Button,
  InputGroup,
  Modal,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError } = useGetAllTasksQuery(undefined);
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (data?.data) {
      setTasks(data.data);
    }
  }, [data]);

  const handleStatusChange = async (
    taskId: string,
    newStatus: "Completed" | "To Do" | "In Progress"
  ) => {
    try {
      await updateTask({
        id: taskId,
        status: newStatus,
      }).unwrap();
      toast.success("Task status updated to ${newStatus}");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const filteredTasks = tasks?.filter(
    (task) =>
      task?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      task?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count tasks by status
  const completedCount = tasks?.filter(
    (task) => task.status === "Completed"
  ).length;
  const inProgressCount = tasks?.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingCount = tasks?.filter((task) => task.status === "To Do").length;
  const totalCount = tasks?.length;

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete).unwrap();
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      } finally {
        setShowDeleteModal(false);
        setTaskToDelete(null);
      }
    }
  };

  return (
    <Container fluid className="py-4 px-4">
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loading state */}
      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your tasks...</p>
          </div>
        </div>
      )}

      {isError && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <div className="text-center">
            <div className="alert alert-danger">
              <h4>Error</h4>
              <p>Failed to load tasks. Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-1">My Tasks</h1>
              <p className="text-muted mb-0">Manage your tasks efficiently</p>
            </div>
            <Button
              variant="primary"
              className="d-flex align-items-center rounded-pill"
              onClick={() => navigate("/add-task")}
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
                    style={{ boxShadow: "none" }}
                  />
                </InputGroup>
              </Col>
              <Col md={7} className="mt-3 mt-md-0">
                <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                  <Button variant="primary" size="sm" className="rounded-pill">
                    All Tasks ({totalCount})
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                  >
                    In Progress ({inProgressCount})
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                  >
                    Completed ({completedCount})
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                  >
                    Pending ({pendingCount})
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          {/* Task cards */}
          <Row>
            {filteredTasks?.map((task) => (
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
                            e.target.value as
                              | "Completed"
                              | "To Do"
                              | "In Progress"
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
            ))}

            {filteredTasks?.length === 0 && (
              <Col xs={12}>
                <div className="text-center p-5 bg-white rounded shadow-sm">
                  <h4>No tasks found</h4>
                  <p className="text-muted">
                    Try adjusting your search or add new tasks
                  </p>
                </div>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
