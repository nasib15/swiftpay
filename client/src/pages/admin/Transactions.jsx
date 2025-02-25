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
      id: "TRX123459",
      type: "send-money",
      amount: 150,
      date: "2023-06-10T09:15:00",
      status: "completed",
      from: "User: 01712345678",
      to: "User: 01912345678",
    },
    {
      id: "TRX123460",
      type: "cash-in",
      amount: 300,
      date: "2023-06-08T11:30:00",
      status: "completed",
      from: "Agent: 01712345678",
      to: "User: 01812345678",
    },
    {
      id: "TRX123461",
      type: "cash-out",
      amount: 500,
      date: "2023-06-05T15:20:00",
      status: "completed",
      from: "User: 01612345678",
      to: "Agent: 01712345678",
    },
    {
      id: "TRX123462",
      type: "send-money",
      amount: 100,
      date: "2023-06-03T13:10:00",
      status: "completed",
      from: "User: 01712345678",
      to: "User: 01812345678",
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

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [userFilter, setUserFilter] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  // Apply filters when filter, searchTerm, dateRange, or userFilter changes
  useEffect(() => {
    let filtered = transactions;

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Apply user filter
    if (userFilter) {
      filtered = filtered.filter(
        (transaction) =>
          (transaction.from &&
            transaction.from
              .toLowerCase()
              .includes(userFilter.toLowerCase())) ||
          (transaction.to &&
            transaction.to.toLowerCase().includes(userFilter.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
  }, [filter, searchTerm, dateRange, userFilter, transactions]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  // Calculate total admin income
  const calculateAdminIncome = () => {
    let income = 0;

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "send-money" && transaction.amount > 100) {
        income += 5; // 5 Tk for send-money over 100 Tk
      } else if (transaction.type === "cash-out") {
        income += transaction.amount * 0.005; // 0.5% for cash-out
      }
    });

    return income.toFixed(2);
  };

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
              <p className="text-sm text-gray-500">Admin Income</p>
              <p className="text-xl font-bold text-green-600">
                {calculateAdminIncome()} Tk
              </p>
            </div>

            <div className="bg-white p-3 rounded shadow-sm flex-1 min-w-[150px]">
              <p className="text-sm text-gray-500">Transaction Types</p>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">
                  {
                    filteredTransactions.filter((t) => t.type === "send-money")
                      .length
                  }{" "}
                  Send
                </span>
                <span className="text-green-600">
                  {
                    filteredTransactions.filter((t) => t.type === "cash-in")
                      .length
                  }{" "}
                  In
                </span>
                <span className="text-orange-600">
                  {
                    filteredTransactions.filter((t) => t.type === "cash-out")
                      .length
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
