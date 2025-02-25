/* eslint-disable react/prop-types */

const TransactionHistory = ({ transactions = [] }) => {
  // Transaction type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case "send-money":
        return "bg-blue-100 text-blue-800";
      case "cash-out":
        return "bg-red-100 text-red-800";
      case "cash-in":
        return "bg-green-100 text-green-800";
      case "balance-request":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Amount with sign
  const formatAmount = (amount, type) => {
    if (type === "cash-in" || type === "balance-request") {
      return `+${amount}`;
    } else if (type === "cash-out" || type === "send-money") {
      return `-${amount}`;
    }
    return amount;
  };

  // Date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Transaction History
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your recent transactions
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
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
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === "cash-in" ||
                      transaction.type === "balance-request"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatAmount(transaction.amount, transaction.type)} Tk
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
