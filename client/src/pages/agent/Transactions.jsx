import { useEffect, useState } from "react";
import TransactionHistory from "../../components/TransactionHistory";

const Transactions = () => {
  // Mock transactions for demonstration
  const [transactions, setTransactions] = useState([
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
    {
      id: "TRX123470",
      type: "cash-in",
      amount: 1000,
      date: "2023-05-28T14:20:00",
      status: "completed",
      to: "User: 01812345678",
    },
    {
      id: "TRX123475",
      type: "cash-out",
      amount: 2000,
      date: "2023-05-25T11:10:00",
      status: "completed",
      from: "User: 01912345678",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  // Apply filters when filter, searchTerm, or dateRange changes
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

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(
        (transaction) => new Date(transaction.date) >= startDate
      );
    }

    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(
        (transaction) => new Date(transaction.date) <= endDate
      );
    }

    setFilteredTransactions(filtered);
  }, [filter, searchTerm, dateRange, transactions]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

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
              <option value="cash-in">Cash In</option>
              <option value="cash-out">Cash Out</option>
              <option value="balance-request">Balance Request</option>
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
              placeholder="Search by ID or user"
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
              onChange={handleDateRangeChange}
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
              onChange={handleDateRangeChange}
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
              <p className="text-sm text-gray-500">Cash In</p>
              <p className="text-xl font-bold text-green-600">
                {
                  filteredTransactions.filter((t) => t.type === "cash-in")
                    .length
                }
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Cash Out</p>
              <p className="text-xl font-bold text-orange-600">
                {
                  filteredTransactions.filter((t) => t.type === "cash-out")
                    .length
                }
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Balance Requests</p>
              <p className="text-xl font-bold text-purple-600">
                {
                  filteredTransactions.filter(
                    (t) => t.type === "balance-request"
                  ).length
                }
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
