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

const socket = io("http://localhost:5000"); // Replace with your backend URL

const TaskBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(formatTasks(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(); // Initial fetch

    socket.on("taskUpdated", (updatedTasks) => {
      setTasks(formatTasks(updatedTasks));
    });

    socket.on("taskAdded", (newTask) => {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[newTask.category || "todo"].push(newTask);
        return { ...updatedTasks };
      });
    });

    return () => {
      socket.off("taskUpdated");
      socket.off("taskAdded");
    };
  }, []);

  // Format tasks into categorized lists
  const formatTasks = (tasksArray) => {
    const groupedTasks = { todo: [], inProgress: [], done: [] };
    tasksArray.forEach((task) => {
      const category = task.category || "todo";
      groupedTasks[category].push(task);
    });

    Object.keys(groupedTasks).forEach((category) => {
      groupedTasks[category].sort((a, b) => a.order - b.order);
    });

    return groupedTasks;
  };

  // Handle Drag End (Reorder or Move to Another Category)
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    let oldCategory = null;
    let newCategory = null;

    // Find the current category of the task
    Object.keys(tasks).forEach((category) => {
      if (tasks[category]?.some((task) => task._id === activeId)) {
        oldCategory = category;
      }
      if (tasks[category]?.some((task) => task._id === overId)) {
        newCategory = category;
      }
    });

    if (!oldCategory) return;
    if (!newCategory) newCategory = oldCategory;

    setTasks((prev) => {
      const newTasks = { ...prev };

      if (oldCategory === newCategory) {
        // Reordering within the same category
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

        // Emit real-time update
        socket.emit("updateTasks", newTasks);

        // Send reorder request to backend
        axios.post("http://localhost:5000/tasks/reorder", {
          category: oldCategory,
          tasks: newTasks[oldCategory].map((task, index) => ({
            _id: task._id,
            order: index,
          })),
        });
      } else {
        // Moving to another category
        const taskToMove = newTasks[oldCategory].find(
          (task) => task._id === activeId
        );
        newTasks[oldCategory] = newTasks[oldCategory].filter(
          (task) => task._id !== activeId
        );
        taskToMove.category = newCategory;
        newTasks[newCategory] = [...(newTasks[newCategory] || []), taskToMove];

        // Emit real-time update
        socket.emit("updateTasks", newTasks);

        // Send category update to backend
        axios
          .patch(`http://localhost:5000/tasks/${activeId}`, {
            category: newCategory,
            newOrder: newTasks[newCategory].length - 1, // Assign last position
          })
        //   .then(() => {
        //     // Send reordering request
        //     axios.post("http://localhost:5000/tasks/reorder", {
        //       category: newCategory,
        //       tasks: newTasks[newCategory].map((task, index) => ({
        //         _id: task._id,
        //         order: index,
        //       })),
        //     });
        //   });
      }

      return newTasks;
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {Object.keys(tasks).map((category) => (
          <div
            key={category}
            className="flex-1 bg-gray-100 p-4 rounded-md shadow-md min-h-[300px]"
          >
            <h2 className="text-lg font-bold text-gray-700 capitalize">
              {category}
            </h2>
            <SortableContext
              items={tasks[category]?.map((task) => task._id) || []}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {tasks[category]?.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <TaskCard key={task._id} task={task} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
