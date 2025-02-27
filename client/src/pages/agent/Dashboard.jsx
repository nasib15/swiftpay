import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import DashboardCard from "../../components/DashboardCard";
import TransactionHistory from "../../components/TransactionHistory";
import { AuthContext } from "../../contexts/AuthContext";

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch agent stats and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agent stats
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/agent/stats`
        );
        setStats(statsResponse.data.data);

        // Fetch agent's transactions
        const transactionsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transactions/${user?._id}`
        );
        setRecentTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate transaction summaries
  const cashInTransactions = recentTransactions.filter(
    (t) => t.transactionType === "cash-in"
  );
  const cashOutTransactions = recentTransactions.filter(
    (t) => t.transactionType === "cash-out"
  );

  const cashInTotal = cashInTransactions.reduce((sum, t) => sum + t.amount, 0);
  const cashOutTotal = cashOutTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Agent Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DashboardCard
            title="Current Balance"
            value={`${stats.balance.toLocaleString()} Tk`}
            isBlurred={true}
            color="blue"
          />

          <DashboardCard
            title="Total Income"
            value={`${stats.income.toLocaleString()} Tk`}
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

          <Link to="/agent/withdraw-request" className="block">
            <DashboardCard
              title="Withdraw Income"
              value="Request Withdrawal"
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
            to="/agent/withdraw-request"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Withdraw Income</span>
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
                {cashInTransactions.length}
              </span>
              <span className="text-green-600 text-sm font-medium">
                {cashInTotal.toLocaleString()} Tk
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-700 mb-2">Cash Out</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-orange-600">
                {cashOutTransactions.length}
              </span>
              <span className="text-orange-600 text-sm font-medium">
                {cashOutTotal.toLocaleString()} Tk
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-700 mb-2">Income Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-purple-600">
                {stats.income.toLocaleString()} Tk
              </span>
              <Link
                to="/agent/withdraw-request"
                className="text-purple-600 text-sm font-medium hover:text-purple-800"
              >
                Withdraw →
              </Link>
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
              to="/agent/transactions"
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

export default AgentDashboard;
