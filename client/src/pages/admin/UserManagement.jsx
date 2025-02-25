import { useState } from "react";

const UserManagement = () => {
  // Users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "01712345678",
      email: "john@example.com",
      type: "user",
      balance: 1240,
      status: "active",
      createdAt: "2023-05-10T10:30:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "01812345678",
      email: "jane@example.com",
      type: "user",
      balance: 2500,
      status: "active",
      createdAt: "2023-05-15T14:20:00",
    },
    {
      id: 3,
      name: "Robert Johnson",
      phone: "01912345678",
      email: "robert@example.com",
      type: "agent",
      balance: 98500,
      income: 1500,
      status: "active",
      createdAt: "2023-04-20T09:15:00",
    },
    {
      id: 4,
      name: "Emily Davis",
      phone: "01612345678",
      email: "emily@example.com",
      type: "agent",
      balance: 120000,
      income: 2200,
      status: "active",
      createdAt: "2023-04-25T11:30:00",
    },
    {
      id: 5,
      name: "Michael Wilson",
      phone: "01512345678",
      email: "michael@example.com",
      type: "user",
      balance: 800,
      status: "blocked",
      createdAt: "2023-05-05T16:45:00",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter users based on filter and search term
  const filteredUsers = users.filter((user) => {
    // Filter by type
    if (filter !== "all" && user.type !== filter) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(term) ||
        user.phone.includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    return true;
  });

  // Handle user status change
  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setShowModal(false);
  };

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

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
              <option value="all">All Users</option>
              <option value="user">Users Only</option>
              <option value="agent">Agents Only</option>
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
              placeholder="Search by name, phone, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Balance
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.type === "agent"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.balance.toLocaleString()} Tk
                    {user.type === "agent" && (
                      <div className="text-xs text-green-600">
                        Income: {user.income.toLocaleString()} Tk
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    {user.status === "active" ? (
                      <button
                        onClick={() => handleStatusChange(user.id, "blocked")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(user.id, "active")}
                        className="text-green-600 hover:text-green-900"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">
                    {selectedUser.type.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="font-medium">
                    {selectedUser.balance.toLocaleString()} Tk
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-medium ${
                      selectedUser.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedUser.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined On</p>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedUser.type === "agent" && (
                  <div>
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="font-medium text-green-600">
                      {selectedUser.income.toLocaleString()} Tk
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        selectedUser.id,
                        selectedUser.status === "active" ? "blocked" : "active"
                      )
                    }
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      selectedUser.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {selectedUser.status === "active"
                      ? "Block User"
                      : "Unblock User"}
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md">
                    View Transactions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
