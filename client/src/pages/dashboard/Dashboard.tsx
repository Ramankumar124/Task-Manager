import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/redux/api/tasksApi";
import type { Task } from "@/types/taskTypes";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TaskCard from "./TaskCard";
import DeleteTaskCard from "./DeleteTaskCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | "In Progress" | "Completed" | "To Do"
  >("All");
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
      toast.success(`Task status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch =
      task?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      task?.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "In Progress") return task.status === "In Progress";
    if (activeFilter === "Completed") return task.status === "Completed";
    if (activeFilter === "To Do") return task.status === "To Do";

    return true;
  });

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
      } catch (error: any) {
        toast.error("Failed to delete task");
      } finally {
        setShowDeleteModal(false);
        setTaskToDelete(null);
      }
    }
  };

  const handleFilterClick = (
    filter: "All" | "In Progress" | "Completed" | "To Do"
  ) => {
    setActiveFilter(filter);
  };

  return (
    <Container fluid className="py-4 px-4">
      <DeleteTaskCard
        setShowDeleteModal={setShowDeleteModal}
        isDeleting={isDeleting}
        showDeleteModal={showDeleteModal}
        confirmDelete={confirmDelete}
      />

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
              <div className="dashboard-header">
                <h3 className="text-md! md:text-4xl!">My Tasks</h3>
                <p className="text-muted mb-0 text-sm! md:text-lg!">
                  Manage your tasks efficiently
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              className="d-flex align-items-center rounded-pill text-sm!"
              onClick={() => navigate("/add-task")}
            >
              <i className="bi bi-plus-lg me-1 text-xs!"></i> Add New Task
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
                  <Button
                    variant={
                      activeFilter === "All" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="rounded-pill"
                    onClick={() => handleFilterClick("All")}
                  >
                    All Tasks ({totalCount})
                  </Button>
                  <Button
                    variant={
                      activeFilter === "In Progress"
                        ? "primary"
                        : "outline-primary"
                    }
                    size="sm"
                    className="rounded-pill"
                    onClick={() => handleFilterClick("In Progress")}
                  >
                    In Progress ({inProgressCount})
                  </Button>
                  <Button
                    variant={
                      activeFilter === "Completed"
                        ? "primary"
                        : "outline-primary"
                    }
                    size="sm"
                    className="rounded-pill"
                    onClick={() => handleFilterClick("Completed")}
                  >
                    Completed ({completedCount})
                  </Button>
                  <Button
                    variant={
                      activeFilter === "To Do" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    className="rounded-pill"
                    onClick={() => handleFilterClick("To Do")}
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
              <TaskCard
                task={task}
                handleDeleteClick={handleDeleteClick}
                handleStatusChange={handleStatusChange}
                isUpdating={isUpdating}
              />
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
