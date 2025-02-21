import React, { useContext, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaTasks } from "react-icons/fa";
import { AuthContext } from "../provider/AuthProvider";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";

const AddTask = () => {
  const { user, logOut } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "todo",
    endDate: "",
  });

  const handleClose = () => {
    setIsModalOpen(false);
    setTask({ title: "", description: "", category: "todo", endDate: "" }); // Reset form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, category, endDate } = task;
    const formattedEndDate = endDate
      ? format(new Date(endDate), "yyyy-MM-dd HH:mm:ss")
      : null;

    const email = user?.email;

    // console.log({ title, description, category, formattedEndDate, email });

    try {
      const response = await axios.post(`${import.meta.env.VITE_url}/tasks`, {
        email,
        title,
        description,
        category,
        endDate: formattedEndDate,
      });

      if (response) {
        handleClose();
        Swal.fire({
          title: "Added!",
          text: "Your task has been added.",
          icon: "success",
          iconColor: "#FF4500",
          confirmButtonColor: "#FF4500",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl px-4 mx-auto mt-4 flex justify-between items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 cursor-pointer bg-[#FF633C] text-white font-semibold rounded-lg shadow-md hover:bg-[#FF4500] transition duration-300 flex items-center gap-2"
        >
          <FaTasks /> Add Task
        </button>
        <div className="flex gap-5 text-white text-center">
          <button onClick={logOut} className="cursor-pointer">
            <FiLogOut className="text-3xl" />
          </button>
          <div>
            <img
              referrerPolicy="no-referrer"
              src={user?.photoURL}
              alt="img"
              className="w-12 h-12 rounded-full border-2 border-white mx-auto"
            />
            <h1>{user?.displayName}</h1>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-2xl px-5 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4 border-b border-gray-300">
              Add Task
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Description
                </label>
                <textarea
                  value={task.description}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Category
                </label>
                <select
                  value={task.category}
                  onChange={(e) =>
                    setTask({ ...task, category: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="todo">To-Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={task.endDate}
                  onChange={(e) =>
                    setTask({ ...task, endDate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTask;
