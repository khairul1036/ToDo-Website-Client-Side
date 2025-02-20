import TaskCard from "./TaskCard";

const TaskBoard = () => {
  return (
    <div className="grid lg:grid-cols-3 px-5 gap-10 pt-5 lg:pt-10 ">
      {/* To-Do board  */}
      <div className="w-full max-w-md mx-auto bg-white py-2 rounded-lg shadow-lg">
        <h2 className="text-lg md:text-2xl font-semibold text-center text-gray-700 mb-4 border-b border-gray-300 pb-2">
          To-Do
        </h2>

        {/* single card content  */}
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>

      {/* In Progress board  */}
      <div className="w-full max-w-md mx-auto bg-white py-2 rounded-lg shadow-lg">
        <h2 className="text-lg md:text-2xl font-semibold text-center text-gray-700 mb-4 border-b border-gray-300 pb-2">
          In Progress
        </h2>
        {/* single card content  */}
        <TaskCard />
      </div>

      {/* done board  */}
      <div className="w-full max-w-md mx-auto bg-white py-2 rounded-lg shadow-lg">
        <h2 className="text-lg md:text-2xl font-semibold text-center text-gray-700 pb-2 mb-4 border-b border-gray-300">
          Done
        </h2>
        {/* single card content  */}
        <TaskCard />
        <TaskCard />
      </div>
    </div>
  );
};

export default TaskBoard;
