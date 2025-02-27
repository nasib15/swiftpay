import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    pin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.pin.trim()) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        navigate(`/${result.user.accountType}`);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="identifier"
        >
          Mobile Number or Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="identifier"
          name="identifier"
          type="text"
          placeholder="Enter mobile number or email"
          value={formData.identifier}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="pin"
        >
          PIN
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="pin"
          name="pin"
          type="password"
          placeholder="Enter your 5-digit PIN"
          maxLength={5}
          value={formData.pin}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
