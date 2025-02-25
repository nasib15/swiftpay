import { useEffect, useState } from "react";
import TransactionHistory from "../../components/TransactionHistory";

const Transactions = () => {
  // Transactions
  const [transactions, setTransactions] = useState([
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
    {
      id: "TRX123459",
      type: "send-money",
      amount: 150,
      date: "2023-06-10T09:15:00",
      status: "completed",
      to: "User: 01912345678",
    },
    {
      id: "TRX123460",
      type: "cash-in",
      amount: 300,
      date: "2023-06-08T11:30:00",
      status: "completed",
      from: "Agent: 01712345678",
    },
    {
      id: "TRX123461",
      type: "cash-out",
      amount: 500,
      date: "2023-06-05T15:20:00",
      status: "completed",
      to: "Agent: 01612345678",
    },
    {
      id: "TRX123462",
      type: "send-money",
      amount: 100,
      date: "2023-06-03T13:10:00",
      status: "completed",
      to: "User: 01812345678",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  // Apply filters when filter or searchTerm changes
  useEffect(() => {
    let filtered = transactions;

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (transaction.to &&
            transaction.to.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (transaction.from &&
            transaction.from.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
  }, [filter, searchTerm, transactions]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction History
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="filter"
            >
              Filter by Type
            </label>
            <select
              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-xl font-bold">{transactions.length}</p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Send Money</p>
              <p className="text-xl font-bold text-blue-600">
                {transactions.filter((t) => t.type === "send-money").length}
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Cash In</p>
              <p className="text-xl font-bold text-green-600">
                {transactions.filter((t) => t.type === "cash-in").length}
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Cash Out</p>
              <p className="text-xl font-bold text-orange-600">
                {transactions.filter((t) => t.type === "cash-out").length}
              </p>
            </div>
          </div>
        </div>

        <TransactionHistory transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Transactions;
