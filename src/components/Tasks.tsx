import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import addTaskSVG from "../assets/add-icon.svg";
import TaskItem from "./TaskItem";

interface TaskProps {
  infoToast: (info: string) => void;
  warningToast: (warning: string) => void;
}

type Task = {
  task: string;
  edit: boolean;
  createdAt: string;
  editedAt: string | null;
};

type prevTask = {
  task: string;
  index: number;
};

const getSavedTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.log("Error parsing tasks from localStorage", error);
    return [];
  }
};

const Tasks: React.FC<TaskProps> = ({ infoToast, warningToast }) => {
  const [taskList, setTaskList] = useState<Task[]>(getSavedTasks);
  const [prevTask, setPrevTask] = useState<prevTask[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const taskTextArea = form.task as HTMLTextAreaElement;
    const task = taskTextArea.value.trim();

    if (!task) return;

    // If a variable "task" exists in the same scope
    // { task } is automatically expanded to { task: task }.
    setTaskList((prevList) => [
      ...prevList,
      {
        task,
        edit: false,
        createdAt: new Date().toISOString(),
        editedAt: null,
      },
    ]);

    taskTextArea.value = "";
    infoToast("Task added successfully");

    // Handle add task animation
    setShouldAnimate(true);
    setTimeout(() => setShouldAnimate(false), 300);
  };

  // Toggles edit mode for a specific task
  const toggleEditMode = (index: number) => {
    setPrevTask([...prevTask, { task: taskList[index].task, index: index }]);
    setTaskList((prevList) =>
      prevList.map((task, i) =>
        i === index ? { ...task, edit: !task.edit } : task
      )
    );

    if (taskList[index].edit) {
      if (taskList[index].task) {
        if (taskList[index].task !== prevTask[index].task) {
          // Send a toast only when the task is actually updated
          infoToast("Task updated successfully!");

          // Add the editedAt field to the task
          setTaskList((prevList) =>
            prevList.map((task, i) =>
              i === index
                ? { ...task, editedAt: new Date().toISOString() }
                : task
            )
          );
        }
      } else {
        warningToast("An existing task cannot be empty!");
        if (prevTask) {
          setTaskList((prevList) =>
            prevList.map((task, i) =>
              i === index ? { ...task, task: prevTask[index].task } : task
            )
          );
        }
      }
    }
  };

  // Allows users to update their tasks
  const handleUpdate = (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const input = e.target.value;
    setTaskList((prevList) =>
      prevList.map((task, i) => (i === index ? { ...task, task: input } : task))
    );
  };

  // Delete a specific task
  const handleDelete = (index: number) => {
    setTaskList((prevList) => prevList.filter((_, i) => i !== index));
    infoToast("Task Deleted!");
  };

  return (
    <section className="task-container">
      <h1 className="task-title">CURRENT TASKS</h1>
      <TaskItem
        taskList={taskList}
        toggleEditMode={toggleEditMode}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />

      <form onSubmit={addTask} className="form-container">
        <label htmlFor="task" className="form-label">
          task
        </label>
        <div className="input-wrapper">
          <div className="task-wrapper">
            <TextareaAutosize
              required
              rows={1}
              name="task"
              className="task-input"
              placeholder="Read documentation..."
              id="task-input"
            />
          </div>
          <div>
            <button type="submit" title="add task" className="btn btn-small">
              <motion.img
                src={addTaskSVG}
                alt="add task"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: shouldAnimate ? [0, -180] : -180,
                }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Tasks;
