/* eslint-disable react/prop-types */

const typeColors = {
  "send-money": "bg-blue-100 text-blue-800",
  "cash-out": "bg-red-100 text-red-800",
  "cash-in": "bg-green-100 text-green-800",
  "balance-request": "bg-purple-100 text-purple-800",
  "withdrawal-request": "bg-orange-100 text-orange-800",
};

const formatAmount = (amount, type) => {
  const sign = ["cash-in", "balance-request"].includes(type) ? "+" : "-";
  return `${sign}${amount}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TransactionHistory = ({ transactions = [] }) => {
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        typeColors[transaction.transactionType] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {transaction.transactionType
                        .replace("-", " ")
                        .toUpperCase()}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      ["cash-in", "balance-request"].includes(
                        transaction.transactionType
                      )
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatAmount(
                      transaction.amount,
                      transaction.transactionType
                    )}{" "}
                    Tk
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
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
