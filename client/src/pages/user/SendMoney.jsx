import { useState } from "react";

const SendMoney = () => {
  const [formData, setFormData] = useState({
    recipientPhone: "",
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

    // Update fee if amount changes
    if (name === "amount") {
      const amount = parseFloat(value) || 0;
      setFee(amount > 100 ? 5 : 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Empty validation
    if (
      !formData.recipientPhone.trim() ||
      !formData.amount.trim() ||
      !formData.pin.trim()
    ) {
      setError("All fields are required");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 50) {
      setError("Minimum amount is 50 Tk");
      return;
    }

    if (formData.pin.length !== 5) {
      setError("PIN must be 5 digits");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(
        `Successfully sent ${amount} Tk to ${formData.recipientPhone}`
      );
      setFormData({
        recipientPhone: "",
        amount: "",
        pin: "",
      });
    }, 1500);
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
              htmlFor="recipientPhone"
            >
              Recipient&apos;s Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="recipientPhone"
              name="recipientPhone"
              type="text"
              placeholder="Enter recipient's phone number"
              value={formData.recipientPhone}
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
              min="50"
              placeholder="Enter amount (minimum 50 Tk)"
              value={formData.amount}
              onChange={handleChange}
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
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-md font-semibold text-blue-800 mb-2">
          Send Money Information
        </h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Minimum amount for sending money is 50 Tk</li>
          <li>A fee of 5 Tk will be charged for transactions over 100 Tk</li>
          <li>Make sure the recipient&apos;s phone number is correct</li>
          <li>Transaction cannot be reversed once completed</li>
        </ul>
      </div>
    </div>
  );
};

export default SendMoney;
