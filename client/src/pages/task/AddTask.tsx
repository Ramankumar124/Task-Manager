import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  useAddTaskMutation,
  useEnhanceTaskMutation,
} from "@/redux/api/tasksApi";
import toast from "react-hot-toast";
import { taskSchema } from "@/types/TaskSchema";
import type { TaskFormData } from "@/types/taskTypes";
import { useState, useEffect } from "react";

const AddTask = () => {
  const navigate = useNavigate();
  const [addTask] = useAddTaskMutation();
  const [enhanceTask, { isLoading: IsEnhancing }] = useEnhanceTaskMutation();
  const [enhanceTaskData, setEnhanceTaskData] = useState({
    title: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
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

  const watchedTitle = watch("title");
  const watchedDescription = watch("description");

  useEffect(() => {
    setEnhanceTaskData({
      title: watchedTitle,
      description: watchedDescription,
    });
  }, [watchedTitle, watchedDescription]);

  const handleEnhanceWithAi = async () => {
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
        toast.error("Failed to get enhancement data from AI");
      }
    } catch (error: unknown) {
      console.error("Error enhancing task with AI:", error);
      toast.error("Failed to enhance task with AI.");
    }
  };

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    try {
      await addTask(data).unwrap();
      toast.success("Task Added succesfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  return (
    <Container fluid className="p-4">
      <h2 className=" text-md! md:text-lg">Add New Task</h2>
      <p className="text-muted mb-4 text-sm! md:text-lg!">Create a new task to manage your work</p>
      <Card className="shadow-2xl border-0">
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
              className="bg-gradient-to-r from-purple-700 to-blue-500 text-white border-0 py-2 md:px-4 rounded text-xs! md:text-lg!"
              onClick={handleEnhanceWithAi}
              disabled={IsEnhancing || (!watchedTitle && !watchedDescription)}
            >
              {IsEnhancing ? "Enhancing...." : "Enhance with AI"}
            </Button>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3 mt-8">
              <Form.Label className="text-sm! md:text-md!">Task Title</Form.Label>
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

            <div className="d-flex justify-content-end">
              <Button
                variant="light"
                className="me-2"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddTask;
