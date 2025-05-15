import * as yup from "yup";


export const TaskSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: yup
    .string()
    .required("Description is required")
    .max(500, "Description must be less than 500 characters"),

  priority: yup
    .string()
    .required("Priority is required")
    .oneOf(["High", "Medium", "Low"], "Priority must be High, Medium, or Low"),

  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["To Do", "In Progress", "Completed"],
      "Status must be To Do, In Progress, or Completed"
    ),

  dueDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .min(new Date(), "Due date cannot be in the past")
    .typeError("Due date must be a valid date"),
});
