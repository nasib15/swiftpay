import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    nid: "",
    pin: "",
    confirmPin: "",
    accountType: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Empty validation
    if (
      !formData.name.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.nid.trim() ||
      !formData.pin.trim() ||
      !formData.confirmPin.trim()
    ) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      toast.error("PINs do not match");
      setIsLoading(false);
      return;
    }

    if (formData.pin.length !== 5) {
      toast.error("PIN must be 5 digits");
      setIsLoading(false);
      return;
    }

    if (formData.nid.length !== 13) {
      toast.error("NID must be 13 digits");
      setIsLoading(false);
      return;
    }

    if (formData.mobile.length !== 11) {
      toast.error("Mobile number must be 11 digits");
      setIsLoading(false);
      return;
    }

    const userInfo = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      nid: formData.nid,
      pin: formData.pin,
      accountType: formData.accountType,
    };

    try {
      const result = await register(userInfo);

      if (result.success) {
        navigate(`/login`);
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mobile"
          >
            Mobile Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mobile"
            name="mobile"
            type="text"
            placeholder="Enter your mobile number"
            value={formData.mobile}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nid"
          >
            NID Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nid"
            name="nid"
            type="number"
            placeholder="Enter your NID number"
            value={formData.nid}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pin"
          >
            5-Digit PIN
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="pin"
            name="pin"
            type="password"
            placeholder="Enter a 5-digit PIN"
            maxLength={5}
            value={formData.pin}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPin"
          >
            Confirm PIN
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPin"
            name="confirmPin"
            type="password"
            placeholder="Confirm your PIN"
            maxLength={5}
            value={formData.confirmPin}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="accountType"
          >
            Account Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="accountType"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};
export default RegisterForm;
