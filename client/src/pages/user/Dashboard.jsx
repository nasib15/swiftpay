import { useState } from "react";
import { Link } from "react-router";
import DashboardCard from "../../components/DashboardCard";
import TransactionHistory from "../../components/TransactionHistory";

const UserDashboard = () => {
  const [balance] = useState(1240);

  const [recentTransactions] = useState([
    {
      id: "TRX123456",
      type: "cash-in",
      amount: 500,
      date: "2023-06-15T10:30:00",
      status: "completed",
      from: "Agent: 01712345678",
    },
    {
      id: "TRX123457",
      type: "send-money",
      amount: 200,
      date: "2023-06-14T14:20:00",
      status: "completed",
      to: "User: 01812345678",
    },
    {
      id: "TRX123458",
      type: "cash-out",
      amount: 1000,
      date: "2023-06-12T16:45:00",
      status: "completed",
      to: "Agent: 01612345678",
    },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          User Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Current Balance"
            value={`${balance} Tk`}
            isBlurred={true}
            color="blue"
          />

          <Link to="/user/send-money" className="block">
            <DashboardCard
              title="Send Money"
              value="Transfer Funds"
              color="green"
            />
          </Link>

          <Link to="/user/cash-out" className="block">
            <DashboardCard
              title="Cash Out"
              value="Withdraw Funds"
              color="orange"
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
            to="/user/send-money"
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Send Money</span>
          </Link>

          <Link
            to="/user/cash-out"
            className="bg-white p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow"
          >
            <div className="text-orange-500 text-3xl mb-2">
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
            <span className="text-gray-700 font-medium">Cash Out</span>
          </Link>

          <Link
            to="/user/transactions"
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

      <div>
        <TransactionHistory transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default UserDashboard;
