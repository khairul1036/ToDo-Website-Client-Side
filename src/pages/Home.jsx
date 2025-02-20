import AddTask from "../components/AddTask";
import TaskBoard from "../components/TaskBoard";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19377B] to-[#3A104C]">
      <div>
        <h1 className="text-white font-bold text-lg md:text-3xl flex justify-center p-5">
          Task Management Application
        </h1>
      </div>

      {/* add task  */}
      <AddTask />
      {/* add task  */}

      {/* task board  */}
      <TaskBoard />

      {/* <TaskList/> */}
    </div>
  );
};

export default Home;
