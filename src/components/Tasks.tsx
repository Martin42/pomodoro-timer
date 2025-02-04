import { useEffect, useState } from "react";

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
  const [taskList, setTaskList] = useState<
    {
      task: string;
      edit: boolean;
      createdAt: string;
      editedAt: string | null;
    }[]
  >(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const [prevTask, setPrevTask] = useState<string | null>(null);

  const [taskAnimation, setTaskAnimation] = useState<boolean>(false);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const taskTextArea = form.task as HTMLTextAreaElement;
    const task = taskTextArea.value;

    if (!task) return;

    // If a variable "task" exists in the same scope, { task } is automatically expanded to { task: task }.
    setTaskList((prevList) => [
      ...prevList,
      {
        task,
        edit: false,
        createdAt: new Date().toISOString(),
        editedAt: null,
      },
    ]);

    // Reset textarea value and height
    taskTextArea.value = "";
    taskTextArea.style.height = "unset";

    toast("Task added successfully");
  };

  // Toggles edit mode for a specific task
  const toggleEditMode = (index: number) => {
    setPrevTask(taskList[index].task);
    setTaskList((prevList) =>
      prevList.map((task, i) =>
        i === index ? { ...task, edit: !task.edit } : task
      )
    );

    if (taskList[index].edit) {
      if (taskList[index].task !== prevTask) {
        // Send a toast only when the task is actually updated
        toast("Task updated successfully!");

        // Add the editedAt field to the task
        setTaskList((prevList) =>
          prevList.map((task, i) =>
            i === index ? { ...task, editedAt: new Date().toISOString() } : task
          )
        );
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

  // Resize Textarea function
  const resizeTextArea = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <section className="task-container">
      <h1 className="task-title">CURRENT TASKS</h1>
      {taskList.length > 0 &&
        taskList.map((element, index) => (
          <motion.div
            key={index}
            className="input-wrapper"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="task-wrapper">
              <label htmlFor="task" className="form-label">
                task
              </label>
              <textarea
                rows={1}
                name="task"
                placeholder="task placeholder"
                value={element.task}
                className={!element.edit ? "task" : "task-input"}
                disabled={!element.edit}
                onChange={(e) => handleUpdate(index, e)}
                onInput={resizeTextArea}
              />
              <span className="task-date">
                {(() => {
                  const date = element.editedAt || element.createdAt;
                  const label = element.editedAt ? "Edited at:" : "Created at:";
                  return `${label} ${new Date(date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`;
                })()}
              </span>
            </div>
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
          <textarea
            rows={1}
            name="task"
            className="task-input"
            placeholder="Read documentation..."
            id="task-input"
            onInput={resizeTextArea}
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
