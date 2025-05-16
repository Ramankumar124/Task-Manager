import { Container, Row, Col} from "react-bootstrap"; 
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
    <Container fluid className="p-4 h-100">
      <div
        className="bg-white rounded shadow-sm p-4"
        style={{ position: "relative" }}
      >
        <div
          className="absolute top-6 right-6 z-10"
        >
          <button
            type="button"
            onClick={handleEnhanceWithAi}
            disabled={IsEnhancing || (!watchedTitle && !watchedDescription)}
            className={`bg-gradient-to-r from-purple-700 to-blue-500 text-white py-2 px-4 rounded
              ${(IsEnhancing || (!watchedTitle && !watchedDescription)) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {IsEnhancing ? "Enhancing...." : "Enhance with AI"}
          </button>
        </div>
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
              <div className="text-danger">{errors.title.message}</div>
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
              <div className="text-danger">{errors.description.message}</div>
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
                  <div className="text-danger">{errors.dueDate.message}</div>
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
                  <div className="text-danger">{errors.priority.message}</div>
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
              <div className="text-danger">{errors.status.message}</div>
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
