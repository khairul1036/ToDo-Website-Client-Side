import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../provider/AuthProvider";

const socket = io("http://localhost:5000");

const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingCategory, setDraggingCategory] = useState(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks/${user?.email}`);
      setTasks(formatTasks(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
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

        // Ensure the category is valid before attempting to push
        if (updatedTasks[newTask?.category]) {
          updatedTasks[newTask?.category].push(newTask);
        } else {
          console.error(`Invalid category: ${newTask?.category}`);
        }

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
      if (groupedTasks[category]) {
        groupedTasks[category].push(task);
      }
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

    // Allow dragging into an empty category, or a category with tasks
    setDraggingCategory(over.id);
  };

  // Handle Drag End (Reorder and move tasks between categories)
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setDraggingTask(null);
    setDraggingCategory(null);

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

        axios.post(`http://localhost:5000/tasks/reorder/${user?.email}`, {
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

        axios.patch(`http://localhost:5000/tasks/${user?.email}/${activeId}`, {
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
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-4 p-4">
        {Object.keys(tasks).map((category) => (
          <div
            key={category}
            className={`flex-1 p-4 rounded-md shadow-md min-h-[300px] bg-gray-100 ${
              draggingCategory === category
                ? "bg-gray-200 border-2 border-blue-500"
                : "" // Highlight category when being hovered
            }`}
          >
            <h2 className="text-lg font-bold text-gray-700 capitalize mb-2">
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
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <TaskCard fetchTasks={fetchTasks} key={task._id} task={task} />
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
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
