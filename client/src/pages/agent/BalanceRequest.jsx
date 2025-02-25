import { useState } from "react";

const BalanceRequest = () => {
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
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

    // Empty validation
    if (
      !formData.amount.trim() ||
      !formData.reason.trim() ||
      !formData.pin.trim()
    ) {
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

    // Loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(
        `Balance request for ${amount} Tk has been submitted successfully. Request ID: REQ${Math.floor(
          Math.random() * 1000000
        )}`
      );
      setFormData({
        amount: "",
        reason: "",
        pin: "",
      });
    }, 1500);
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
              htmlFor="amount"
            >
              Amount (Tk)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              name="amount"
              type="number"
              min="1000"
              placeholder="Enter amount to request (minimum 1,000 Tk)"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="reason"
            >
              Reason for Request
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="reason"
              name="reason"
              rows="3"
              placeholder="Explain why you need this balance"
              value={formData.reason}
              onChange={handleChange}
            ></textarea>
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Balance Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Request ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  REQ123456
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  100,000 Tk
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Jun 1, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    APPROVED
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  REQ123455
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  50,000 Tk
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  May 15, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    APPROVED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="text-md font-semibold text-purple-800 mb-2">
          Balance Request Information
        </h3>
        <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
          <li>Minimum request amount is 1,000 Tk</li>
          <li>Requests are typically processed within 24 hours</li>
          <li>
            You will be notified once your request is approved or rejected
          </li>
          <li>Provide a clear reason for your request to expedite approval</li>
        </ul>
      </div>
    </div>
  );
};

export default BalanceRequest;
