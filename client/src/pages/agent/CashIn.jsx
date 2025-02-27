import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

const CashIn = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userPhone: "",
    amount: "",
    pin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset user info when phone changes
    if (name === "userPhone") {
      setUserInfo(null);
    }
  };

  // Check if user exists
  const checkUser = async () => {
    if (formData.userPhone.length === 11) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/check/${
            formData.userPhone
          }`
        );
        if (
          response.data.success &&
          response.data.user.accountType === "user"
        ) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(null);
          toast.error("Invalid user number");
        }
      } catch (error) {
        setUserInfo(null);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.userPhone.length === 11) {
        checkUser();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.userPhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.userPhone || !formData.amount || !formData.pin) {
        toast.error("All fields are required");
        return;
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (formData.pin.length !== 5) {
        toast.error("PIN must be 5 digits");
        return;
      }

      if (amount > user.balance) {
        toast.error("Insufficient balance");
        return;
      }

      // Process cash in
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transactions/cash-in`,
        formData
      );

      if (response.data.success) {
        toast.success("Cash in successful!");
        setShowConfirm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process cash in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cash In</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Cash In to User Account
          </h2>
          <p className="text-gray-500 text-sm">
            Add funds to a user&apos;s SwiftPay account
          </p>
        </div>

        {showConfirm ? (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Cash In Successful!
            </h3>
            <div className="space-y-2">
              <p className="text-green-700">
                <span className="font-medium">Amount:</span> {formData.amount}{" "}
                Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">User:</span> {userInfo?.name} (
                {formData.userPhone})
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  userPhone: "",
                  amount: "",
                  pin: "",
                });
                setShowConfirm(false);
                setUserInfo(null);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Cash In Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="userPhone"
              >
                User&apos;s Phone Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="userPhone"
                name="userPhone"
                type="text"
                placeholder="Enter user's phone number"
                value={formData.userPhone}
                onChange={handleChange}
                disabled={isLoading}
              />
              {userInfo ? (
                <p className="mt-1 text-sm text-green-600">
                  User: {userInfo.name}
                </p>
              ) : (
                <p className="mt-1 text-sm text-red-600">User not found</p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="amount"
              >
                Amount (Tk)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="amount"
                name="amount"
                type="number"
                min="1"
                placeholder="Enter amount to cash in"
                value={formData.amount}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                No fee is charged for cash-in transactions
              </p>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="pin"
              >
                Your PIN
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="pin"
                name="pin"
                type="password"
                maxLength={5}
                placeholder="Enter your 5-digit PIN"
                value={formData.pin}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Cash In"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="text-md font-semibold text-green-800 mb-2">
          Cash In Information
        </h3>
        <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
          <li>No fee is charged for cash-in transactions</li>
          <li>Make sure the user&apos;s phone number is correct</li>
          <li>Verify user&apos;s identity before processing</li>
          <li>Transaction cannot be reversed once completed</li>
          <li>Your current balance: {user?.balance} Tk</li>
        </ul>
      </div>
    </div>
  );
};

export default CashIn;
