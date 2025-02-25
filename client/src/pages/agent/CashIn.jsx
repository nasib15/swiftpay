import { useState } from "react";

const CashIn = () => {
  const [formData, setFormData] = useState({
    userPhone: "",
    amount: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setSuccess("");

    // Basic validation
    if (!formData.userPhone || !formData.amount || !formData.pin) {
      setError("All fields are required");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (formData.pin.length !== 5) {
      setError("PIN must be 5 digits");
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(
        `Successfully added ${amount} Tk to user ${formData.userPhone}`
      );
      setFormData({
        userPhone: "",
        amount: "",
        pin: "",
      });
    }, 1500);
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

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
            />
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
            />
            <p className="text-xs text-gray-500 mt-1">
              There is no fee for cash-in transactions.
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
      </div>

      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="text-md font-semibold text-green-800 mb-2">
          Cash In Information
        </h3>
        <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
          <li>There is no fee for cash-in transactions</li>
          <li>Make sure the user&apos;s phone number is correct</li>
          <li>
            Verify the user&apos;s identity before processing the transaction
          </li>
          <li>
            The user will receive a notification once the transaction is
            complete
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashIn;
