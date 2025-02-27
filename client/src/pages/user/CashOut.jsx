import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

const CashOut = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    agentPhone: "",
    amount: "",
    pin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [agentInfo, setAgentInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Calculate fee when amount changes
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    setFee(amount * 0.015); // 1.5% fee
  }, [formData.amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset agent info when phone changes
    if (name === "agentPhone") {
      setAgentInfo(null);
    }
  };

  // Check if agent exists
  const checkAgent = async () => {
    if (formData.agentPhone.length === 11) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/check/${
            formData.agentPhone
          }`
        );
        if (
          response.data.success &&
          response.data.user.accountType === "agent"
        ) {
          setAgentInfo(response.data.user);
        } else {
          setAgentInfo(null);
        }
      } catch (error) {
        setAgentInfo(null);
        toast.error("Invalid agent number");
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.agentPhone.length === 11) {
        checkAgent();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.agentPhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.agentPhone || !formData.amount || !formData.pin) {
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

      const totalAmount = amount + fee;
      if (totalAmount > user.balance) {
        toast.error("Insufficient balance");
        return;
      }

      // Process cash out
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transactions/cash-out`,
        formData
      );

      if (response.data.success) {
        toast.success("Cash out successful!");
        setShowConfirm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cash out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cash Out</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">
              Cash Out from Agent
            </h2>
            <span className="text-sm text-orange-600 font-medium">
              Fee: {fee.toFixed(2)} Tk (1.5%)
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Withdraw cash from a SwiftPay agent
          </p>
        </div>

        {showConfirm ? (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Cash Out Successful!
            </h3>
            <div className="space-y-2">
              <p className="text-green-700">
                <span className="font-medium">Amount:</span> {formData.amount}{" "}
                Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Fee:</span> {fee.toFixed(2)} Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Total:</span>{" "}
                {(parseFloat(formData.amount) + fee).toFixed(2)} Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Agent:</span> {agentInfo?.name} (
                {formData.agentPhone})
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  agentPhone: "",
                  amount: "",
                  pin: "",
                });
                setShowConfirm(false);
                setAgentInfo(null);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Cash Out Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="agentPhone"
              >
                Agent&apos;s Phone Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="agentPhone"
                name="agentPhone"
                type="text"
                placeholder="Enter agent's phone number"
                value={formData.agentPhone}
                onChange={handleChange}
                disabled={isLoading}
              />
              {agentInfo ? (
                <p className="mt-1 text-sm text-green-600">
                  Agent: {agentInfo.name}
                </p>
              ) : (
                <p className="mt-1 text-sm text-red-600">
                  Agent not found or inactive
                </p>
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
                placeholder="Enter amount to cash out"
                value={formData.amount}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                A fee of 1.5% will be charged for cash-out transactions.
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
                className={`bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Cash Out"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <h3 className="text-md font-semibold text-orange-800 mb-2">
          Cash Out Information
        </h3>
        <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
          <li>A fee of 1.5% will be charged for all cash-out transactions</li>
          <li>Make sure the agent&apos;s phone number is correct</li>
          <li>Transaction cannot be reversed once completed</li>
          <li>Your current balance: {user?.balance} Tk</li>
        </ul>
      </div>
    </div>
  );
};

export default CashOut;
