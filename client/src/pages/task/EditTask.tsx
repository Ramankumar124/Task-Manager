import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { useForm } from "react-hook-form"; // Removed watch from here, it will be destructured below
import {
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetSingleTaskQuery,
  useEnhanceTaskMutation,
} from "@/redux/api/tasksApi";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { taskSchema } from "@/types/TaskSchema";
import type { Task, TaskFormData } from "@/types/taskTypes";
import DeleteTaskCard from "../dashboard/DeleteTaskCard";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSingleTaskQuery(id as string);
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [enhanceTask, { isLoading: IsEnhancing }] = useEnhanceTaskMutation();
  const [enhanceTaskData, setEnhanceTaskData] = useState({
    title: "",
    description: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch, // Destructure watch from useForm
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "To Do",
    },
  });

  // Watch for changes in title and description fields
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");

  useEffect(() => {
    if (data?.data) {
      const task: Task = data.data;

      setValue("title", task.title);
      setValue("description", task.description);
      if (task.dueDate) {
        const formattedDate = new Date(task.dueDate)
          .toISOString()
          .split("T")[0];
        setValue("dueDate", formattedDate);
      }
      setValue("priority", task.priority);
      setValue("status", task.status);
      setTaskToDelete(task._id);
      setEnhanceTaskData({ title: task.title, description: task.description });
    }
  }, [data, setValue, setEnhanceTaskData]);

  // Update enhanceTaskData when title or description changes
  useEffect(() => {
    setEnhanceTaskData({
      title: watchedTitle,
      description: watchedDescription,
    });
  }, [watchedTitle, watchedDescription, setEnhanceTaskData]);

  const onSubmit = async (formData: TaskFormData) => {
    try {
      await updateTask({
        id: id as string,
        ...formData,
      }).unwrap();
      toast.success("Task Updated Succesfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete).unwrap();
        toast.success("Task deleted successfully");
        navigate("/dashboard");
      } catch (error: any) {
        toast.error("Failed to delete task");
      } finally {
        setShowDeleteModal(false);
        setTaskToDelete(null);
      }
    }
  };
  const handleEnhanceWithAi = async () => {
    console.log("Enhance task data:", enhanceTaskData);
    try {
      const rawData = await enhanceTask(enhanceTaskData).unwrap();

      if (rawData?.data) {
        const cleanedResponse = JSON.parse(
          rawData.data.replace(/```json|```/g, "").trim()
        );
        if (cleanedResponse.title) {
          setValue("title", cleanedResponse.title);
        }
        if (cleanedResponse.description) {
          setValue("description", cleanedResponse.description);
        }
        toast.success("Task enhanced with AI!");
      } else {
        toast.error("Failed to get enhancement data from AI response.");
      }
    } catch (error: unknown) {
      console.error("Error enhancing task with AI:", error);
      toast.error("Failed to enhance task with AI.");
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading task details...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <DeleteTaskCard
        setShowDeleteModal={setShowDeleteModal}
        isDeleting={isDeleting}
        showDeleteModal={showDeleteModal}
        confirmDelete={confirmDelete}
      />
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              zIndex: 10,
            }}
          >
 
            <Button
              className="bg-gradient-to-r from-purple-700 to-blue-500 text-white border-0 py-2 px-4 rounded"
              onClick={handleEnhanceWithAi} // Corrected onClick handler
            >
              {IsEnhancing ? "Enhancing...." : " Enhance with AI"}
            </Button>
          </div>
          <h2 className="mb-3">Edit Task</h2>
          <p className="text-muted mb-4">Update your task details</p>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                isInvalid={!!errors.title}
                {...register("title")}
              />
              {errors.title && (
                <Form.Control.Feedback type="invalid">
                  {errors.title.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter task description"
                isInvalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <Form.Control.Feedback type="invalid">
                  {errors.description.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    isInvalid={!!errors.dueDate}
                    {...register("dueDate")}
                  />
                  {errors.dueDate && (
                    <Form.Control.Feedback type="invalid">
                      {errors.dueDate.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.priority}
                    {...register("priority")}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                  {errors.priority && (
                    <Form.Control.Feedback type="invalid">
                      {errors.priority.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Status</Form.Label>
              <Form.Select isInvalid={!!errors.status} {...register("status")}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
              {errors.status && (
                <Form.Control.Feedback type="invalid">
                  {errors.status.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Task"}
              </Button>

              <div>
                <Button
                  variant="light"
                  className="me-2"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || isUpdating}
                >
                  {isSubmitting || isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditTask;
