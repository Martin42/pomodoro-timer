import editTaskSVG from "../assets/edit-icon.svg";
import updateTaskSVG from "../assets/update-icon.svg";
import deleteTaskSVG from "../assets/delete-icon.svg";

import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";

type Task = {
  task: string;
  edit: boolean;
  createdAt: string;
  editedAt: string | null;
};

interface TaskItemProps {
  taskList: Task[];
  toggleEditMode: (index: number) => void;
  handleUpdate: (
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleDelete: (index: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  taskList,
  toggleEditMode,
  handleUpdate,
  handleDelete,
}) => {
  return (
    <>
      {taskList.length > 0 &&
        taskList.map((element, index) => (
          <motion.div
            key={index}
            className="input-wrapper"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="task-wrapper">
              <label htmlFor="task" className="form-label">
                task
              </label>
              <TextareaAutosize
                rows={1}
                name="task"
                placeholder="Task"
                value={element.task}
                className={!element.edit ? "task" : "task-input"}
                disabled={!element.edit}
                onChange={(e) => handleUpdate(index, e)}
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
    </>
  );
};

export default TaskItem;
