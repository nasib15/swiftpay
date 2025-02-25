import { useState } from "react";
import { Link, useNavigate } from "react-router";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    pin: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Empty validation
    if (!formData.identifier.trim() || !formData.pin.trim()) {
      setError("All fields are required");
      return;
    }

    navigate(`/user`);
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
