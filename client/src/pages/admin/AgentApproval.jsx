import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TransactionHistory from "../../components/TransactionHistory";

const AgentApproval = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/agent-approvals`
        );
        setAgents(response.data.agents);
      } catch (error) {
        toast.error("Failed to fetch pending agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Fetch agent's transactions
  const fetchTransactions = async (agentId) => {
    setTransactionsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions/${agentId}`
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching transactions"
      );
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleApproval = async (agentId, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/agent-approvals/${agentId}`,
        { status }
      );
      setAgents(agents.filter((agent) => agent._id !== agentId));
      toast.success(
        `Agent ${status === "active" ? "approved" : "rejected"} successfully`
      );
    } catch (error) {
      toast.error("Failed to process agent approval");
    }
  };

  // View agent transactions
  const handleViewTransactions = (agent) => {
    setSelectedAgent(agent);
    setShowTransactions(true);
    fetchTransactions(agent._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Agent Approvals</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {agents.length === 0 ? (
          <p className="text-gray-500 text-center">
            No pending agent approvals
          </p>
        ) : showTransactions ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Transactions for {selectedAgent.name}
              </h2>
              <button
                onClick={() => {
                  setShowTransactions(false);
                  setSelectedAgent(null);
                  setTransactions([]);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to Approvals
              </button>
            </div>
            {transactionsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.mobile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.nid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleApproval(agent._id, "active")}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(agent._id, "rejected")}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentApproval;
