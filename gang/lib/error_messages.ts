import { Task } from "gang/tasks/task"

// Gang-related
export const failRecruit = () => "Failed to recruit member"

// Task-related
export const nullTask = () => "No tasks found"
export const invalidTask = (task: Task, validTasks: Array<Task>) => `Invalid task - ${task}. Valid tasks are: ${validTasks.join(' | ')}`
