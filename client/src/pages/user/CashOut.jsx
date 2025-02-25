import { useState } from "react";

const CashOut = () => {
  const [formData, setFormData] = useState({
    agentPhone: "",
    amount: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fee, setFee] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Calculate fee if amount changes
    if (name === "amount") {
      const amount = parseFloat(value) || 0;
      setFee((amount * 0.015).toFixed(2));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.agentPhone || !formData.amount || !formData.pin) {
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
        `Successfully cashed out ${amount} Tk from agent ${formData.agentPhone}`
      );
      setFormData({
        agentPhone: "",
        amount: "",
        pin: "",
      });
    }, 1500);
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
            {fee > 0 && (
              <span className="text-sm text-orange-600 font-medium">
                Fee: {fee} Tk (1.5%)
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            Withdraw cash from a SwiftPay agent
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
              placeholder="Enter amount to cash out"
              value={formData.amount}
              onChange={handleChange}
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
      </div>

      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <h3 className="text-md font-semibold text-orange-800 mb-2">
          Cash Out Information
        </h3>
        <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
          <li>A fee of 1.5% will be charged for all cash-out transactions</li>
          <li>Make sure the agent&apos;s phone number is correct</li>
          <li>You will need to show your ID to the agent for verification</li>
          <li>Transaction cannot be reversed once completed</li>
        </ul>
      </div>
    </div>
  );
};

export default CashOut;
