import './TaskItem.css';

import { FaTrash } from "react-icons/fa";
import { TbCopyCheckFilled } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import { useState, useEffect } from 'react';

const TaskItem = ({
    task,
    onMoveToTrash,
    onDeleteForever,
    onMoveBackToTodo,
    onToggleTask,
    activeTab
}) => {
    const [visibleTaskId, setVisibleTaskId] = useState(null);

    const toggleOptions = (taskId) => {
        setVisibleTaskId(visibleTaskId === taskId ? null : taskId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (visibleTaskId && !event.target.closest('.task-item')) {
                setVisibleTaskId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [visibleTaskId]);

    return (
        <>
            <li className={`task-item ${task.completed ? "completed" : ""}`}>
                <button onClick={() => toggleOptions(task._id)} className="btn-bs">
                    <BsThreeDotsVertical />
                </button>

                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task._id)}
                    />
                    <span className="checkmark">
                        {task.completed && <AiOutlineCheck className="check-icon" />}
                    </span>
                </label>

                <span className={task.completed ? 'completed-text' : ''}>
                    {task.title}
                </span>
            </li>

            {visibleTaskId === task._id && (
                <div className="options-menu">
                    {activeTab === 'Trash' ? (
                        <div className='trash-menu-wrapper'>
                            <button
                                className="btn-delete-forever"
                                onClick={() => onDeleteForever(task._id)}
                            >
                                <FaTrash />
                                Delete Forever
                            </button>
                            <button
                                className="btn-restore"
                                onClick={() => onMoveBackToTodo(task._id)}
                            >
                                <TbCopyCheckFilled />
                                Move Back to Todo
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn-trash"
                            onClick={() => onMoveToTrash(task._id)}
                        >
                            <FaTrash /> Move to Trash
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default TaskItem;