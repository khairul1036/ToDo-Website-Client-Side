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

const socket = io("http://localhost:5000"); // Replace with your backend URL

const TaskBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Fetch tasks from backend
  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then((response) => {
      setTasks(formatTasks(response.data));
    });

    // Listen for real-time updates
    socket.on("taskUpdated", (updatedTasks) => {
      setTasks(formatTasks(updatedTasks));
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, []);

  // Format tasks into categorized lists
  const formatTasks = (tasksArray) => {
    const groupedTasks = { todo: [], inProgress: [], done: [] };
    tasksArray.forEach((task) => {
      const category = task.category || "todo"; // Default to "todo" if category is missing
      if (!groupedTasks[category]) {
        groupedTasks[category] = [];
      }
      groupedTasks[category].push(task);
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

    // Find the category of the dragged task
    Object.keys(tasks).forEach((category) => {
      if (tasks[category]?.some((task) => task._id === activeId)) {
        oldCategory = category;
      }
    });

    if (!oldCategory) return; // Exit if the category is not found

    const newCategory = over.data.current?.category || oldCategory;

    setTasks((prev) => {
      const newTasks = { ...prev };

      // Reordering within the same category
      if (oldCategory === newCategory) {
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

        // Update backend order
        axios.post("http://localhost:5000/tasks/reorder", {
          category: oldCategory,
          tasks: newTasks[oldCategory]?.map((task, index) => ({
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

        // Update backend with new category & order
        axios
          .patch(`http://localhost:5000/tasks/${activeId}`, {
            category: newCategory,
          })
          .then(() => {
            axios.post("http://localhost:5000/tasks/reorder", {
              category: newCategory,
              tasks: newTasks[newCategory]?.map((task, index) => ({
                _id: task._id,
                order: index,
              })),
            });
          });
      }

      // Emit real-time update
      socket.emit("updateTasks", newTasks);

      return newTasks;
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {Object.keys(tasks).map((category) => (
          <div
            key={category}
            className="flex-1 bg-gray-100 p-4 rounded-md shadow-md"
          >
            <h2 className="text-lg font-bold text-gray-700 capitalize">
              {category}
            </h2>
            <SortableContext
              items={tasks[category]?.map((task) => task._id) || []}
              strategy={verticalListSortingStrategy}
            >
              {/* {Array.isArray(tasks[category]) && tasks[category].map((task) => (
                <TaskCard key={task._id} task={task} />
              ))} */}

              {Array.isArray(tasks[category]) &&
                tasks[category]
                  .sort((a, b) => {
                    // First sort by category name (assuming category is a string)
                    if (a.category < b.category) return -1;
                    if (a.category > b.category) return 1;

                    // If category names are equal, sort by the 'order' field
                    return a.order - b.order;
                  })
                  .map((task) => <TaskCard key={task._id} task={task} />)}
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
