import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User
import CashOut from "./pages/user/CashOut";
import UserDashboard from "./pages/user/Dashboard";
import SendMoney from "./pages/user/SendMoney";
import Transactions from "./pages/user/Transactions";

// Agent
import BalanceRequest from "./pages/agent/BalanceRequest";
import CashIn from "./pages/agent/CashIn";
import AgentDashboard from "./pages/agent/Dashboard";
import AgentTransactions from "./pages/agent/Transactions";

// Admin
import AgentApproval from "./pages/admin/AgentApproval";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTransactions from "./pages/admin/Transactions";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User */}
        <Route path="/user" element={<DashboardLayout userType="user" />}>
          <Route index element={<UserDashboard />} />
          <Route path="send-money" element={<SendMoney />} />
          <Route path="cash-out" element={<CashOut />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>

        {/* Agent */}
        <Route path="/agent" element={<DashboardLayout userType="agent" />}>
          <Route index element={<AgentDashboard />} />
          <Route path="cash-in" element={<CashIn />} />
          <Route path="balance-request" element={<BalanceRequest />} />
          <Route path="transactions" element={<AgentTransactions />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<DashboardLayout userType="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="agent-approval" element={<AgentApproval />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
