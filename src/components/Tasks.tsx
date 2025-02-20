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

const Tasks = ({ infoToast, warningToast }: TaskProps) => {
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
    setTaskList((prevList) => {
      // Find any currently edited task
      const currentlyEditedIndex = prevList.findIndex((task) => task.edit);
      const newList = [...prevList];

      // If another task is being edited, revert it
      if (currentlyEditedIndex !== -1 && currentlyEditedIndex !== index) {
        const originalTask = prevTask.find(
          (t) => t.index === currentlyEditedIndex
        );
        if (originalTask) {
          newList[currentlyEditedIndex] = {
            ...newList[currentlyEditedIndex],
            task: originalTask.task,
            edit: false,
          };
        }
      }

      // Handle current task
      const currentTask = newList[index];
      const isEditing = currentTask.edit;

      // Toggle edit mode
      newList[index] = { ...currentTask, edit: !isEditing };

      // Store original task when entering edit mode
      if (!isEditing) {
        setPrevTask((prev) => [...prev, { task: currentTask.task, index }]);
      } else {
        // Handle validation when saving
        if (!currentTask.task.trim()) {
          warningToast("Task cannot be empty!");
          const original = prevTask.find((t) => t.index === index);
          newList[index].task = original?.task || "";
          return newList;
        }

        if (
          currentTask.task !== prevTask.find((t) => t.index === index)?.task
        ) {
          infoToast("Task updated!");
          newList[index].editedAt = new Date().toISOString();
        }
      }

      return newList;
    });
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
