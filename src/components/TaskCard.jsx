import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Check if the task's endDate has passed (task expired)
  const isExpired = new Date(task?.endDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-lg shadow-md mt-2 cursor-grab ${isExpired ? "bg-red-100" : "bg-white"}`} // Add red border and background if expired
      style={style}
    >
      <h3 className="text-md font-semibold">{task?.title}</h3>
      <p className="text-sm text-gray-500">{task?.description}</p>
      <span className={`text-xs text-gray-400 ${isExpired ? "text-red-500" :""}`}>{new Date(task?.endDate).toLocaleString()}</span>
    </div>
  );
};
