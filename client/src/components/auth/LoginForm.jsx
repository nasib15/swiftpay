import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    pin: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Empty validation
    if (!formData.identifier.trim() || !formData.pin.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      console.log(response.data);

      if (response.data.success) {
        navigate(`/${response.data.user.accountType}`);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
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
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Login
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
    </>
  );
};
export default LoginForm;
