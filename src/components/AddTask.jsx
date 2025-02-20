import React, { useState } from "react";

const AddTask = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
    setTask({ title: "", description: "", category: "todo" }); // Reset form when closed
  };

  return (
    <>
      {/* Add Task Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#FF633C] text-white font-semibold rounded-lg shadow-md hover:bg-[#FF4500] transition duration-300"
        >
          Add Task
        </button>
      </div>

      {/*Add Task Modal Pop-up */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-2xl px-5">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4 border-b border-gray-300">
              Add Task
            </h2>

            {/* Title Field */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Title (max 50 characters)
              </label>
              <input
                id="title"
                type="text"
                name="title"
                maxLength="50"
                placeholder="Enter task title..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF633C] focus:border-transparent"
                required
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Description (optional, max 200 characters)
              </label>
              <textarea
                id="description"
                name="description"
                maxLength="200"
                placeholder="Enter task description..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF633C] focus:border-transparent"
              />
            </div>

            {/* Category Field */}
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF633C] focus:border-transparent"
              >
                <option value="todo">To-Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-[#FF633C] text-white font-semibold rounded-lg hover:bg-[#FF4500] transition duration-300">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTask;
