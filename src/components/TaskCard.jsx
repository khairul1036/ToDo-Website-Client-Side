import React, { useContext, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { format } from "date-fns";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export const TaskCard = ({ fetchTasks, task }) => {
  const { user } = useContext(AuthContext);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const [newTask, setNewTask] = useState({
    title: task?.title,
    description: task?.description,
    category: task?.category,
    endDate: task?.endDate,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Check if the task's endDate has passed (task expired)
  const isExpired = new Date(task?.endDate) < new Date();

  // view details
  const [viewIsModalOpen, setViewIsModalOpen] = useState(false);
  const [updateIsModalOpen, setUpdateIsModalOpen] = useState(false);
  const handleClose = () => {
    setViewIsModalOpen(false);
    setUpdateIsModalOpen(false);
  };

  // task update
  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    const { title, description, category, endDate } = newTask;
    const formattedEndDate = endDate
      ? format(new Date(endDate), "yyyy-MM-dd HH:mm:ss")
      : null;

    const email = user?.email;
    const id = task?._id;

    console.log({ id, title, description, category, formattedEndDate, email });

    // send the updated task data to the backend API to save changes
    axios
      .patch(`http://localhost:5000/tasks/update/${user?.email}/${id}`, {
        title,
        description,
        category,
        endDate: formattedEndDate,
        email,
      })
      .then((response) => {
        fetchTasks();
        Swal.fire({
          title: "Updated!",
          text: "Your task has been updated.",
          icon: "success",
          iconColor: "#FF4500",
          confirmButtonColor: "#FF4500",
        });
        handleClose();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  // task delete
  const handleDelete = async (taskId) => {
    const email = user?.email;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      iconColor: "#FF4500",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#FF4500",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:5000/tasks/${email}/${taskId}`
        );
        fetchTasks();
        if (response) {
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
            iconColor: "#FF4500",
            confirmButtonColor: "#FF4500",
          });
        }
      }
    });
  };
  return (
    <>
      <div
        className={`flex justify-between items-center p-4 rounded-lg shadow-md mt-2 cursor-grab ${
          isExpired ? "bg-red-100" : "bg-white"
        }`} // Add red border and background if expired
        style={style}
      >
        <div ref={setNodeRef} {...attributes} {...listeners} className="w-full">
          <h3 className="text-md font-semibold">{task?.title}</h3>
          <p className="text-sm text-gray-500">
            {task?.description.substring(0, 40)}...
          </p>
          <span
            className={`text-xs text-gray-400 ${
              isExpired ? "text-red-500" : ""
            }`}
          >
            {new Date(task?.endDate).toLocaleString()}
          </span>
        </div>

        {/* Three-Dot Icon Button */}
        <div className="dropdown dropdown-top dropdown-center cursor-pointer">
          <div tabIndex="0" role="button">
            <FiMoreHorizontal className="text-gray-600" size={20} />
          </div>
          <ul
            tabIndex="0"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm"
          >
            <li>
              <button onClick={() => setViewIsModalOpen(true)}>
                <FaRegEye className="text-lg" />
                View
              </button>
            </li>
            <li>
              <button onClick={() => setUpdateIsModalOpen(true)}>
                <FaEdit className="text-lg" />
                Edit
              </button>
            </li>
            <li>
              <button onClick={() => handleDelete(task?._id)}>
                <RiDeleteBin5Line className="text-lg" />
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* view task modal  */}
      {viewIsModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-2xl px-5 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4 border-b border-gray-300">
              View Task
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title
              </label>
              <p className="w-full p-3 border border-gray-300 rounded-md bg-gray-100">
                {task?.title}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description
              </label>
              <p className="w-full p-3 border border-gray-300 rounded-md bg-gray-100">
                {task?.description}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Category
              </label>
              <p className="w-full p-3 border border-gray-300 rounded-md bg-gray-100">
                {task?.category}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                End Date
              </label>
              <p className="w-full p-3 border border-gray-300 rounded-md bg-gray-100">
                {task?.endDate
                  ? new Date(task?.endDate).toLocaleString()
                  : "No end date"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2 cursor-pointer bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* update task modal  */}
      {updateIsModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-2xl px-5 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4 border-b border-gray-300">
              Update Task
            </h2>

            <form onSubmit={handleUpdateSubmit}>
              {/* Title Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  defaultValue={task?.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={task?.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              {/* Category Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Category
                </label>
                <select
                  defaultValue={task?.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="todo">To-Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* End Date Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  defaultValue={task?.endDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, endDate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 cursor-pointer bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 cursor-pointer bg-[#FF633C] text-white font-semibold rounded-lg hover:bg-[#FF4500]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
