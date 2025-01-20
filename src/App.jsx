import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";

function App() {
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    navigate(type === "admin" ? "/dashboard" : "/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Bynry Frontend Developer Internship Assignment
        </h1>
        <h2 className="text-xl text-gray-600">Profile Management & Mapping</h2>
      </div>
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => handleUserTypeSelect("user")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span>Proceed as User</span>
        </button>

        <button
          onClick={() => handleUserTypeSelect("admin")}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <span>Admin Login</span>
        </button>
      </div>

      <div className="mt-4 text-center text-gray-500">
        <p>Select your user type to continue</p>
      </div>
    </div>
  );
}

export default App;
