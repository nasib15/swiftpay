import { useState } from "react";
import { Link } from "react-router";
import DashboardCard from "../../components/DashboardCard";
import TransactionHistory from "../../components/TransactionHistory";

const AgentDashboard = () => {
  // Balance
  const [balance] = useState(98500);
  // Income
  const [income] = useState(1500);

  // Recent transactions
  const [recentTransactions] = useState([
    {
      id: "TRX123456",
      type: "cash-in",
      amount: 500,
      date: "2023-06-15T10:30:00",
      status: "completed",
      to: "User: 01712345678",
    },
    {
      id: "TRX123458",
      type: "cash-out",
      amount: 1000,
      date: "2023-06-12T16:45:00",
      status: "completed",
      from: "User: 01612345678",
    },
    {
      id: "TRX123460",
      type: "cash-in",
      amount: 300,
      date: "2023-06-08T11:30:00",
      status: "completed",
      to: "User: 01712345678",
    },
    {
      id: "TRX123461",
      type: "cash-out",
      amount: 500,
      date: "2023-06-05T15:20:00",
      status: "completed",
      from: "User: 01612345678",
    },
    {
      id: "TRX123465",
      type: "balance-request",
      amount: 100000,
      date: "2023-06-01T09:15:00",
      status: "completed",
      from: "Admin",
    },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Agent Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Current Balance"
            value={`${balance} Tk`}
            isBlurred={true}
            color="blue"
          />

          <DashboardCard
            title="Total Income"
            value={`${income} Tk`}
            isBlurred={true}
            color="green"
          />

          <Link to="/agent/balance-request" className="block">
            <DashboardCard
              title="Balance Request"
              value="Request Funds"
              color="purple"
            />
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/agent/cash-in"
            className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow"
          >
            <div className="text-green-500 text-3xl mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Cash In</span>
          </Link>

          <Link
            to="/agent/balance-request"
            className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow"
          >
            <div className="text-purple-500 text-3xl mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Balance Request</span>
          </Link>

          <Link
            to="/agent/transactions"
            className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow"
          >
            <div className="text-blue-500 text-3xl mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Transactions</span>
          </Link>

          <div className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-red-500 text-3xl mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Help & Support</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Transaction Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-700 mb-2">Cash In</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">
                {recentTransactions.filter((t) => t.type === "cash-in").length}
              </span>
              <span className="text-green-600 text-sm font-medium">
                {recentTransactions
                  .filter((t) => t.type === "cash-in")
                  .reduce((sum, t) => sum + t.amount, 0)}{" "}
                Tk
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-700 mb-2">Cash Out</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-orange-600">
                {recentTransactions.filter((t) => t.type === "cash-out").length}
              </span>
              <span className="text-orange-600 text-sm font-medium">
                {recentTransactions
                  .filter((t) => t.type === "cash-out")
                  .reduce((sum, t) => sum + t.amount, 0)}{" "}
                Tk
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-700 mb-2">Balance Requests</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-purple-600">
                {
                  recentTransactions.filter((t) => t.type === "balance-request")
                    .length
                }
              </span>
              <span className="text-purple-600 text-sm font-medium">
                {recentTransactions
                  .filter((t) => t.type === "balance-request")
                  .reduce((sum, t) => sum + t.amount, 0)}{" "}
                Tk
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <TransactionHistory transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default AgentDashboard;
