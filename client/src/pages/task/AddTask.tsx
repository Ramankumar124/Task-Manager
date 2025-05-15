import { Container, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Priority = "High" | "Medium" | "Low";
type Status = "To Do" | "In Progress" | "Completed";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string | null | undefined;
  priority: Priority;
  status: Status;

}

const taskSchema = yup.object().shape({
  title: yup.string().required("Task title is required"),
  description: yup.string().required("Description is required"),
  dueDate: yup.string().nullable(),
  priority: yup
    .string()
    .oneOf(["High", "Medium", "Low"])
    .required("Priority is required"),
  status: yup
    .string()
    .oneOf(["To Do", "In Progress", "Completed"])
    .required("Status is required"),
});

const AddTask = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
    },
  });

  // Watch the form values


  const onSubmit = async (data: TaskFormData) => {

  };

  return (
    <Container fluid className="p-4 h-100">
      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="mb-3">Add New Task</h2>
        <p className="text-muted mb-4">Create a new task to manage your work</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="taskTitle" className="">
              Task Title
            </label>
            <input
              type="text"
              className="form-control shadow-sm"
              id="taskTitle"
              placeholder="Enter task title"
              {...register("title")}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="taskDescription" className="fw-medium">
              Description
            </label>
            <textarea
              className="form-control shadow-sm"
              id="taskDescription"
              rows={4}
              placeholder="Enter task description"
              {...register("description")}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <div className="mb-3">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="dueDate"
                  {...register("dueDate")}
                />
                {errors.dueDate && (
                  <div className="invalid-feedback">
                    {errors.dueDate.message}
                  </div>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  className="form-select"
                  {...register("priority")}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                {errors.priority && (
                  <div className="invalid-feedback">
                    {errors.priority.message}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <div className="mb-3">
            <label htmlFor="status">Status</label>
            <select id="status" className="form-select" {...register("status")}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && (
              <div className="invalid-feedback">{errors.status.message}</div>
            )}
          </div>

       

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddTask;
