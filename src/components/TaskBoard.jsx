import React, { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { io } from "socket.io-client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

const socket = io("http://localhost:5000");

const TaskBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingCategory, setDraggingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setIsLoading(true); // Set loading state to true when starting fetch
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(formatTasks(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch completes
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on("taskUpdated", (updatedTasks) => {
      setTasks(formatTasks(updatedTasks));
    });

    socket.on("taskAdded", (newTask) => {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[newTask?.category].push(newTask);
        return { ...updatedTasks };
      });
    });

    return () => {
      socket.off("taskUpdated");
      socket.off("taskAdded");
    };
  }, []);

  const formatTasks = (tasksArray) => {
    const groupedTasks = { todo: [], inProgress: [], done: [] };
    tasksArray.forEach((task) => {
      const category = task?.category;
      groupedTasks[category].push(task);
    });

    Object.keys(groupedTasks).forEach((category) => {
      groupedTasks[category].sort((a, b) => a.order - b.order);
    });

    return groupedTasks;
  };

  // Handle Drag Start
  const handleDragStart = (event) => {
    setDraggingTask(event.active.id);
  };

  // Handle Drag Over (Allow dragging into empty categories as well)
  const handleDragOver = (event) => {
    const { over } = event;
    if (!over || tasks[over.id] === undefined) return false; // Ensure category exists

    setDraggingCategory(over.id);
  };

  // Handle Drag End (Reorder and move tasks between categories)
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setDraggingTask(null);
    setDraggingCategory(null); // Reset on drag end

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    let oldCategory = null;
    let newCategory = null;

    // Find the categories
    Object.keys(tasks).forEach((category) => {
      if (tasks[category]?.some((task) => task._id === activeId)) {
        oldCategory = category;
      }
      if (
        tasks[category]?.some((task) => task._id === overId) ||
        tasks[category]?.length === 0
      ) {
        newCategory = category;
      }
    });

    if (!oldCategory || !newCategory || newCategory === "") return;

    // Perform the task reordering and moving
    setTasks((prev) => {
      const newTasks = { ...prev };

      if (oldCategory === newCategory) {
        // Move task within the same category
        const oldIndex = newTasks[oldCategory].findIndex(
          (task) => task._id === activeId
        );
        const newIndex = newTasks[oldCategory].findIndex(
          (task) => task._id === overId
        );
        newTasks[oldCategory] = arrayMove(
          newTasks[oldCategory],
          oldIndex,
          newIndex
        );

        socket.emit("updateTasks", newTasks);

        axios.post("http://localhost:5000/tasks/reorder", {
          category: oldCategory,
          tasks: newTasks[oldCategory].map((task, index) => ({
            _id: task._id,
            order: index,
          })),
        });
      } else {
        // Move task to a different category
        const taskToMove = newTasks[oldCategory].find(
          (task) => task._id === activeId
        );
        newTasks[oldCategory] = newTasks[oldCategory].filter(
          (task) => task._id !== activeId
        );
        taskToMove.category = newCategory;
        newTasks[newCategory] = [...(newTasks[newCategory] || []), taskToMove];

        socket.emit("updateTasks", newTasks);

        axios.patch(`http://localhost:5000/tasks/${activeId}`, {
          category: newCategory,
          newOrder: newTasks[newCategory].length - 1,
        });
      }

      return newTasks;
    });
  };


  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-4 px-4 py-10">
        {isLoading ? (
          // Show loading spinner while fetching tasks
          <div className="flex justify-center items-center w-full h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          Object.keys(tasks).map((category) => (
            <div
              key={category}
              className={`flex-1 p-4 rounded-md shadow-md min-h-[300px] bg-gray-100 ${
                draggingCategory === category
                  ? "bg-gray-200 border-2 border-blue-500"
                  : "" // Highlight category when being hovered
              }`}
              style={{
                transition: "background-color 0.2s ease, border 0.2s ease", // Smooth transition for background and border
              }}
            >
              <h2 className="text-lg font-bold text-gray-700 capitalize pb-2 text-center border-b border-gray-300 mb-5">
                {category}
              </h2>
              <SortableContext
                items={tasks[category]?.map((task) => task._id) || []}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {tasks[category]?.length > 0 ? (
                    tasks[category]?.map((task) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <TaskCard key={task._id} task={task} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm text-center py-10 border-dashed border-2 border-gray-300 rounded-md">
                      No tasks
                    </div>
                  )}
                </AnimatePresence>
              </SortableContext>
            </div>
          ))
        )}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
