import * as yup from "yup";

export const taskSchema = yup.object({
  title: yup.string().required("Task title is required"),
  description: yup.string().required("Description is required"),
  dueDate: yup.string().required("Due Date is Required"),
  priority: yup
    .string()
    .oneOf(["High", "Medium", "Low"])
    .required("Priority is required"),
  status: yup
    .string()
    .oneOf(["To Do", "In Progress", "Completed"])
    .required("Status is required"),
});
