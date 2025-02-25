import { useState } from "react";

const AgentApproval = () => {
  // Agent requests
  const [agentRequests, setAgentRequests] = useState([
    {
      id: 1,
      name: "David Brown",
      phone: "01712345678",
      email: "david@example.com",
      nid: "1234567890",
      status: "pending",
      createdAt: "2023-06-10T10:30:00",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      phone: "01812345678",
      email: "sarah@example.com",
      nid: "2345678901",
      status: "pending",
      createdAt: "2023-06-12T14:20:00",
    },
    {
      id: 3,
      name: "Michael Lee",
      phone: "01912345678",
      email: "michael@example.com",
      nid: "3456789012",
      status: "pending",
      createdAt: "2023-06-15T09:15:00",
    },
    {
      id: 4,
      name: "Jennifer Wilson",
      phone: "01612345678",
      email: "jennifer@example.com",
      nid: "4567890123",
      status: "approved",
      createdAt: "2023-06-05T11:30:00",
    },
    {
      id: 5,
      name: "Robert Davis",
      phone: "01512345678",
      email: "robert@example.com",
      nid: "5678901234",
      status: "rejected",
      createdAt: "2023-06-08T16:45:00",
    },
  ]);

  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter agent requests based on filter and search term
  const filteredRequests = agentRequests.filter((agent) => {
    // Filter by status
    if (filter !== "all" && agent.status !== filter) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        agent.name.toLowerCase().includes(term) ||
        agent.phone.includes(term) ||
        agent.email.toLowerCase().includes(term) ||
        agent.nid.includes(term)
      );
    }

    return true;
  });

  // Handle agent status change
  const handleStatusChange = (agentId, newStatus) => {
    setAgentRequests(
      agentRequests.map((agent) =>
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    );
    setShowModal(false);
  };

  // View agent details
  const handleViewAgent = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Agent Approval</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="filter"
            >
              Filter by Status
            </label>
            <select
              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
              placeholder="Search by name, phone, email, or NID"
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
                  NID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
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
              {filteredRequests.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied{" "}
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.phone}</div>
                    <div className="text-sm text-gray-500">{agent.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.nid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        agent.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : agent.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {agent.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewAgent(agent)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    {agent.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(agent.id, "approved")
                          }
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(agent.id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Details Modal */}
      {showModal && selectedAgent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Agent Request Details
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
                  <p className="font-medium">{selectedAgent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedAgent.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedAgent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NID</p>
                  <p className="font-medium">{selectedAgent.nid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Application Date</p>
                  <p className="font-medium">
                    {new Date(selectedAgent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p
                    className={`font-medium ${
                      selectedAgent.status === "approved"
                        ? "text-green-600"
                        : selectedAgent.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedAgent.status.toUpperCase()}
                  </p>
                </div>
              </div>

              {selectedAgent.status === "pending" && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        handleStatusChange(selectedAgent.id, "approved")
                      }
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
                    >
                      Approve Agent
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedAgent.id, "rejected")
                      }
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md"
                    >
                      Reject Agent
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentApproval;
