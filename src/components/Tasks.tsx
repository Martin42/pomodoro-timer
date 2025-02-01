import { useState } from "react";

//SVG Imports
import addTaskSVG from "../assets/add-icon.svg";
import editTaskSVG from "../assets/edit-icon.svg";
import updateTaskSVG from "../assets/update-icon.svg";
import deleteTaskSVG from "../assets/delete-icon.svg";

import { motion } from "framer-motion";

interface TaskProps {
  toast: (info: string) => void;
}

const Tasks: React.FC<TaskProps> = ({ toast }) => {
  const [taskList, setTaskList] = useState<{ task: string; edit: boolean }[]>(
    []
  );

  const [taskAnimation, setTaskAnimation] = useState(false);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const taskInput = form.task as HTMLInputElement;
    const task = taskInput.value;

    if (!task) return;

    // If a variable "task" exists in the same scope, { task } is automatically expanded to { task: task }.
    setTaskList((prevList) => [...prevList, { task, edit: false }]);
    taskInput.value = "";
    toast("Task added successfully");
  };

  // Toggles edit mode for a specific task
  const toggleEditMode = (index: number) => {
    setTaskList((prevList) =>
      prevList.map((task, i) =>
        i === index ? { ...task, edit: !task.edit } : task
      )
    );
    // TO DO: Figure out how to send a toast when a task is updated
  };

  // Allows users to update their tasks
  const handleUpdate = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    setTaskList((prevList) =>
      prevList.map((task, i) => (i === index ? { ...task, task: input } : task))
    );
  };

  // Delete a specific task
  const handleDelete = (index: number) => {
    setTaskList(taskList.filter((_, i) => i !== index));
    toast("Task Deleted!");
  };

  // Animate button click
  const animateAddTask = () => {
    const input = document.getElementById("task-input") as HTMLInputElement;
    if (input && input.value.trim() !== "") {
      setTaskAnimation(true);

      setTimeout(() => {
        setTaskAnimation(false);
      }, 300);
    }
  };

  return (
    <section className="task-container">
      <h1 className="task-title">CURRENT TASKS</h1>
      {taskList.length > 0 &&
        taskList.map((element, index) => (
          <motion.div
            // TO DO: Sort tasks by newest first
            // TO DO: Add animation for when the div is deleted
            key={index}
            className="input-wrapper"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <input
              type="text"
              value={element.task}
              className={!element.edit ? "task" : "task-input"}
              disabled={!element.edit}
              onChange={(e) => handleUpdate(index, e)}
            />
            <div className="task-options-container">
              <button
                type="button"
                title="edit"
                className="btn btn-small"
                onClick={() => toggleEditMode(index)}
              >
                <motion.img
                  // adding key attribute forces image re-render allowing for animation
                  key={element.edit ? "update" : "edit"}
                  src={element.edit ? updateTaskSVG : editTaskSVG}
                  alt={element.edit ? "Update Task Icon" : "Edit Task Icon"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              </button>
              <button
                type="button"
                className="btn btn-small"
                title="delete"
                onClick={() => handleDelete(index)}
              >
                <img src={deleteTaskSVG} alt="Delete Task Icon" />
              </button>
            </div>
          </motion.div>
        ))}

      <form onSubmit={addTask} className="form-container">
        <label htmlFor="task" className="form-label">
          task
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            name="task"
            className="task-input"
            placeholder="Read documentation..."
            id="task-input"
          />
          <button
            type="submit"
            title="add task"
            className="btn btn-small"
            onClick={animateAddTask}
          >
            <motion.img
              src={addTaskSVG}
              alt="add task"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: taskAnimation ? [0, -180] : -180,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </button>
        </div>
      </form>
    </section>
  );
};

export default Tasks;
