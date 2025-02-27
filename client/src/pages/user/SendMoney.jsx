import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

const SendMoney = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    receiverPhone: "",
    amount: "",
    pin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Calculate fee when amount changes
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0;
    setFee(amount >= 100 ? 5 : 0);
  }, [formData.amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset receiver info when phone changes
    if (name === "receiverPhone") {
      setReceiverInfo(null);
    }
  };

  // Check receiver exists
  const checkReceiver = async () => {
    if (formData.receiverPhone.length === 11) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/check/${
            formData.receiverPhone
          }`
        );
        if (response.data.success) {
          setReceiverInfo(response.data.user);
        }
      } catch (error) {
        setReceiverInfo(null);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.receiverPhone.length === 11) {
        checkReceiver();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.receiverPhone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.receiverPhone || !formData.amount || !formData.pin) {
        toast.error("All fields are required");
        return;
      }

      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 50) {
        toast.error("Minimum amount is 50 Tk");
        return;
      }

      if (formData.pin.length !== 5) {
        toast.error("PIN must be 5 digits");
        return;
      }

      if (formData.receiverPhone === user.mobile) {
        toast.error("You cannot send money to yourself");
        return;
      }

      const totalAmount = amount + fee;
      if (totalAmount > user.balance) {
        toast.error("Insufficient balance");
        return;
      }

      // Send money
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transactions/send-money`,
        formData
      );

      if (response.data.success) {
        toast.success("Money sent successfully!");
        // Show transaction details
        setShowConfirm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send money");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Send Money</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">
              Send Money to Another User
            </h2>
            {fee > 0 && (
              <span className="text-sm text-orange-600 font-medium">
                Fee: {fee} Tk
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            Transfer funds to another SwiftPay user
          </p>
        </div>

        {showConfirm ? (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Transaction Successful!
            </h3>
            <div className="space-y-2">
              <p className="text-green-700">
                <span className="font-medium">Amount:</span> {formData.amount}{" "}
                Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Fee:</span> {fee} Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Total:</span>{" "}
                {parseFloat(formData.amount) + fee} Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Sent to:</span>{" "}
                {receiverInfo?.name} ({formData.receiverPhone})
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  receiverPhone: "",
                  amount: "",
                  pin: "",
                });
                setShowConfirm(false);
                setReceiverInfo(null);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="receiverPhone"
              >
                Receiver&apos;s Phone Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="receiverPhone"
                name="receiverPhone"
                type="number"
                placeholder="Enter receiver's phone number"
                value={formData.receiverPhone}
                onChange={handleChange}
                disabled={isLoading}
              />
              {receiverInfo ? (
                <p className="mt-1 text-sm text-green-600">
                  Receiver: {receiverInfo.name}
                </p>
              ) : (
                <p className="mt-1 text-sm text-red-600">Receiver not found</p>
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
                min="50"
                placeholder="Enter amount (minimum 50 Tk)"
                value={formData.amount}
                onChange={handleChange}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum amount: 50 Tk. Fee of 5 Tk applies for transactions over
                100 Tk.
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
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Send Money"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-md font-semibold text-blue-800 mb-2">
          Send Money Information
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Minimum amount for sending money is 50 Tk</li>
          <li>A fee of 5 Tk will be charged for transactions over 100 Tk</li>
          <li>Make sure the receiver&apos;s phone number is correct</li>
          <li>Transaction cannot be reversed once completed</li>
          <li>Your current balance: {user?.balance} Tk</li>
        </ul>
      </div>
    </div>
  );
};

export default SendMoney;
