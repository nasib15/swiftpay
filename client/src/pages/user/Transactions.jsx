import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import TransactionHistory from "../../components/TransactionHistory";
import { AuthContext } from "../../contexts/AuthContext";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transactions/${user?._id}`
        );
        setTransactions(response.data.transactions);
      } catch {
        toast.error("Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user?._id]);

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.transactionType === filter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.reference
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (transaction.sender?.name &&
            transaction.sender.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (transaction.receiver?.name &&
            transaction.receiver.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(
        (transaction) => new Date(transaction.createdAt) >= startDate
      );
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction History
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
            </select>
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="search"
            >
              Search
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="search"
              type="text"
              placeholder="Search by ID or user/agent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-xl font-bold">{filteredTransactions.length}</p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">
                {filteredTransactions
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}{" "}
                Tk
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Transaction Types</p>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">
                  {
                    filteredTransactions.filter(
                      (t) => t.transactionType === "send-money"
                    ).length
                  }{" "}
                  Send
                </span>
                <span className="text-green-600">
                  {
                    filteredTransactions.filter(
                      (t) => t.transactionType === "cash-in"
                    ).length
                  }{" "}
                  In
                </span>
                <span className="text-orange-600">
                  {
                    filteredTransactions.filter(
                      (t) => t.transactionType === "cash-out"
                    ).length
                  }{" "}
                  Out
                </span>
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
