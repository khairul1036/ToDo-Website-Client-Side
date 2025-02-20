import { FaEdit, FaRegEye } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi"; // Importing the 3-dot icon
import { RiDeleteBin5Line } from "react-icons/ri";

const TaskCard = () => {
  return (
    <>
      {" "}
      {/* task card content  */}
      <div className="flex justify-between items-center bg-gray-100 p-4 mx-2 mb-2 rounded-lg transition duration-300 hover:scale-102 hover:shadow-xl">
        {/* Task Content */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700">SCIC Session</h3>
          <p className="text-sm text-gray-500">
            Mock interview session. here learn
          </p>
          <span className="text-xs text-gray-400">to-do</span>
        </div>

        {/* Three-Dot Icon Button */}
        <div class="dropdown dropdown-top dropdown-center">
          <div tabindex="0" role="button">
            <FiMoreHorizontal className="text-gray-600" size={20} />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm"
          >
            <li>
              <button>
                <FaRegEye className="text-lg" />
                View
              </button>
            </li>
            <li>
              <button>
                <FaEdit className="text-lg" />
                Edit
              </button>
            </li>
            <li>
              <button>
                <RiDeleteBin5Line className="text-lg" />
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
