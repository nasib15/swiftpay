import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

const BalanceRequest = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    amount: 100000,
    pin: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

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

    try {
      // Validation
      if (!formData.pin) {
        toast.error("All fields are required");
        return;
      }

      if (formData.pin.length !== 5) {
        toast.error("PIN must be 5 digits");
        return;
      }

      // Submit request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/agent/balance-request`,
        formData
      );

      if (response.data.success) {
        toast.success("Balance request submitted successfully");
        setRequestDetails(response.data.transaction);
        setShowConfirm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Balance Request</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Request Balance from Admin
          </h2>
          <p className="text-gray-500 text-sm">
            Submit a request to recharge your agent account
          </p>
        </div>

        {showConfirm ? (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Request Submitted Successfully!
            </h3>
            <div className="space-y-2">
              <p className="text-green-700">
                <span className="font-medium">Reference:</span>{" "}
                {requestDetails.reference}
              </p>
              <p className="text-green-700">
                <span className="font-medium">Amount:</span> {formData.amount}{" "}
                Tk
              </p>
              <p className="text-green-700">
                <span className="font-medium">Date:</span>{" "}
                {new Date(requestDetails.date).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  amount: "",
                  pin: "",
                });
                setShowConfirm(false);
                setRequestDetails(null);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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
                className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Submitting Request..." : "Submit Balance Request"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="text-md font-semibold text-purple-800 mb-2">
          Balance Request Information
        </h3>
        <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
          <li>Your current balance: {user?.balance} Tk</li>
          <li>Requests are typically processed within 24 hours</li>
          <li>
            You will be notified once your request is approved or rejected
          </li>
          <li>Approved requests will add 100,000 Tk to your balance</li>
        </ul>
      </div>
    </div>
  );
};

export default BalanceRequest;
