import { useState } from "react";
import { Link } from "react-router";
import DashboardCard from "../../components/DashboardCard";
import TransactionHistory from "../../components/TransactionHistory";

const AdminDashboard = () => {
  // Balance
  const [systemBalance] = useState(1250000);
  const [adminIncome] = useState(15000);
  const [pendingApprovals] = useState(3);

  // Recent transactions
  const [recentTransactions] = useState([
    {
      id: "TRX123456",
      type: "cash-in",
      amount: 500,
      date: "2023-06-15T10:30:00",
      status: "completed",
      from: "Agent: 01712345678",
      to: "User: 01812345678",
    },
    {
      id: "TRX123457",
      type: "send-money",
      amount: 200,
      date: "2023-06-14T14:20:00",
      status: "completed",
      from: "User: 01712345678",
      to: "User: 01812345678",
    },
    {
      id: "TRX123458",
      type: "cash-out",
      amount: 1000,
      date: "2023-06-12T16:45:00",
      status: "completed",
      from: "User: 01612345678",
      to: "Agent: 01712345678",
    },
    {
      id: "TRX123465",
      type: "balance-request",
      amount: 100000,
      date: "2023-06-01T09:15:00",
      status: "completed",
      from: "Admin",
      to: "Agent: 01712345678",
    },
  ]);

  // User statistics
  const userStats = {
    totalUsers: 1250,
    totalAgents: 45,
    activeUsers: 980,
    activeAgents: 40,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="System Balance"
            value={`${systemBalance.toLocaleString()} Tk`}
            color="blue"
          />

          <DashboardCard
            title="Admin Income"
            value={`${adminIncome.toLocaleString()} Tk`}
            color="green"
          />

          <Link to="/admin/agent-approval" className="block">
            <DashboardCard
              title="Pending Approvals"
              value={pendingApprovals}
              color={pendingApprovals > 0 ? "red" : "green"}
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
            to="/admin/user-management"
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">User Management</span>
          </Link>

          <Link
            to="/admin/agent-approval"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Agent Approval</span>
          </Link>

          <Link
            to="/admin/transactions"
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
            <span className="text-gray-700 font-medium">System Settings</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            User Statistics
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">
                {userStats.totalUsers}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {userStats.activeUsers}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Agents</p>
              <p className="text-2xl font-bold text-purple-600">
                {userStats.totalAgents}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Active Agents</p>
              <p className="text-2xl font-bold text-orange-600">
                {userStats.activeAgents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Transaction Summary
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Send Money</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  recentTransactions.filter((t) => t.type === "send-money")
                    .length
                }
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Cash In</p>
              <p className="text-2xl font-bold text-green-600">
                {recentTransactions.filter((t) => t.type === "cash-in").length}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Cash Out</p>
              <p className="text-2xl font-bold text-orange-600">
                {recentTransactions.filter((t) => t.type === "cash-out").length}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Balance Requests</p>
              <p className="text-2xl font-bold text-purple-600">
                {
                  recentTransactions.filter((t) => t.type === "balance-request")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h2>
        <TransactionHistory transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
