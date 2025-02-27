import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import DashboardCard from "../../components/DashboardCard";
import TransactionHistory from "../../components/TransactionHistory";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSystemMoney: 0,
    adminIncome: 0,
  });
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    activeUsers: 0,
    activeAgents: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch system stats
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`
        );
        setStats(statsResponse.data.data);

        // Fetch user stats
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/users`
        );
        const users = usersResponse.data.users;

        setUserStats({
          totalUsers: users.filter((u) => u.accountType === "user").length,
          totalAgents: users.filter((u) => u.accountType === "agent").length,
          activeUsers: users.filter(
            (u) => u.accountType === "user" && u.status === "active"
          ).length,
          activeAgents: users.filter(
            (u) => u.accountType === "agent" && u.status === "active"
          ).length,
        });

        // Fetch pending agent approvals
        const approvalsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/agent-approvals`
        );
        setPendingApprovals(approvalsResponse.data.agents.length);

        // Fetch recent transactions
        const transactionsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transactions`
        );
        setRecentTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate transaction summaries
  const sendMoneyTransactions = recentTransactions.filter(
    (t) => t.transactionType === "send-money"
  );
  const cashInTransactions = recentTransactions.filter(
    (t) => t.transactionType === "cash-in"
  );
  const cashOutTransactions = recentTransactions.filter(
    (t) => t.transactionType === "cash-out"
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="System Balance"
            value={`${stats.totalSystemMoney} Tk`}
            color="blue"
          />

          <DashboardCard
            title="Admin Income"
            value={`${stats.adminIncome} Tk`}
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
            to="/admin/withdrawal-approvals"
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
            <span className="text-gray-700 font-medium">
              Withdrawal Approvals
            </span>
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
                {sendMoneyTransactions.length}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Cash In</p>
              <p className="text-2xl font-bold text-green-600">
                {cashInTransactions.length}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Cash Out</p>
              <p className="text-2xl font-bold text-orange-600">
                {cashOutTransactions.length}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.adminIncome.toLocaleString()} Tk
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h2>
        <TransactionHistory transactions={recentTransactions.slice(0, 5)} />
        {recentTransactions.length > 5 && (
          <div className="mt-4 text-center">
            <Link
              to="/admin/transactions"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Transactions →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
