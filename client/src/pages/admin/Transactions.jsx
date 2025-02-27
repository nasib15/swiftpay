import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TransactionHistory from "../../components/TransactionHistory";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [userFilter, setUserFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transactions`
        );
        setTransactions(response.data.transactions);
      } catch (error) {
        toast.error("Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.transactionType === filter
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply user filter
    if (userFilter) {
      filtered = filtered.filter(
        (transaction) =>
          (transaction.sender?.mobile &&
            transaction.sender.mobile
              .toLowerCase()
              .includes(userFilter.toLowerCase())) ||
          (transaction.receiver?.mobile &&
            transaction.receiver.mobile
              .toLowerCase()
              .includes(userFilter.toLowerCase()))
      );
    }

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(
        (transaction) => new Date(transaction.createdAt) >= startDate
      );
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(
        (transaction) => new Date(transaction.createdAt) <= endDate
      );
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate admin income
  const calculateAdminIncome = () => {
    let income = 0;

    filteredTransactions.forEach((transaction) => {
      if (
        transaction.transactionType === "send-money" &&
        transaction.amount > 100
      ) {
        income += 5; // 5 Tk for send-money over 100 Tk
      } else if (transaction.transactionType === "cash-out") {
        income += transaction.amount * 0.005; // 0.5% for cash-out
      }
    });

    return income;
  };

  // Calculate transaction summaries
  const sendMoneyTransactions = filteredTransactions.filter(
    (t) => t.transactionType === "send-money"
  );
  const cashInTransactions = filteredTransactions.filter(
    (t) => t.transactionType === "cash-in"
  );
  const cashOutTransactions = filteredTransactions.filter(
    (t) => t.transactionType === "cash-out"
  );
  const balanceRequests = filteredTransactions.filter(
    (t) => t.transactionType === "balance-request"
  );
  const withdrawalRequests = filteredTransactions.filter(
    (t) => t.transactionType === "withdrawal-request"
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction Management
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="filter"
            >
              Filter by Type
            </label>
            <select
              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="send-money">Send Money</option>
              <option value="cash-in">Cash In</option>
              <option value="cash-out">Cash Out</option>
              <option value="balance-request">Balance Request</option>
              <option value="withdrawal-request">Withdrawal Request</option>
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="search"
            >
              Search by Transaction ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="search"
              type="text"
              placeholder="Enter transaction ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="userFilter"
            >
              Filter by User/Agent
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="userFilter"
              type="text"
              placeholder="Enter phone number"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startDate"
                name="start"
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endDate"
              >
                End Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endDate"
                name="end"
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-xl font-bold">{filteredTransactions.length}</p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">
                {filteredTransactions
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}{" "}
                Tk
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-500">Admin Income</p>
              <p className="text-xl font-bold text-green-600">
                {calculateAdminIncome().toLocaleString()} Tk
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-500">Transaction Types</p>
              <div className="grid grid-cols-3 gap-2 text-sm mt-1">
                <div>
                  <p className="text-blue-600 font-medium">Send Money</p>
                  <p className="text-blue-600">
                    {sendMoneyTransactions.length}
                  </p>
                </div>
                <div>
                  <p className="text-green-600 font-medium">Cash In</p>
                  <p className="text-green-600">{cashInTransactions.length}</p>
                </div>
                <div>
                  <p className="text-orange-600 font-medium">Cash Out</p>
                  <p className="text-orange-600">
                    {cashOutTransactions.length}
                  </p>
                </div>
                <div>
                  <p className="text-purple-600 font-medium">Balance</p>
                  <p className="text-purple-600">{balanceRequests.length}</p>
                </div>
                <div>
                  <p className="text-red-600 font-medium">Withdraw</p>
                  <p className="text-red-600">{withdrawalRequests.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TransactionHistory transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Transactions;
