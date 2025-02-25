/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

// User navigation items
const userNavigation = [
  { name: "Dashboard", path: "/user" },
  { name: "Send Money", path: "/user/send-money" },
  { name: "Cash Out", path: "/user/cash-out" },
  { name: "Transactions", path: "/user/transactions" },
];

// Agent navigation items
const agentNavigation = [
  { name: "Dashboard", path: "/agent" },
  { name: "Cash In", path: "/agent/cash-in" },
  { name: "Balance Request", path: "/agent/balance-request" },
  { name: "Transactions", path: "/agent/transactions" },
];

// Admin navigation items
const adminNavigation = [
  { name: "Dashboard", path: "/admin" },
  { name: "User Management", path: "/admin/user-management" },
  { name: "Agent Approval", path: "/admin/agent-approval" },
  { name: "Transactions", path: "/admin/transactions" },
];

const DashboardLayout = ({ userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation based on user type
  const navigation =
    userType === "admin"
      ? adminNavigation
      : userType === "agent"
      ? agentNavigation
      : userNavigation;

  // User type display name
  const userTypeDisplay =
    userType === "admin" ? "Admin" : userType === "agent" ? "Agent" : "User";

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-blue-700 text-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-blue-600">
            <h1 className="text-xl font-bold">SwiftPay</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white"
            >
              <svg
                className="w-6 h-6"
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
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "bg-blue-800 text-white"
                      : "text-blue-100 hover:bg-blue-600"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-blue-600">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-blue-100 hover:bg-blue-600"
            >
              <svg
                className="mr-3 h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-blue-700 lg:text-white">
        <div className="flex items-center justify-center h-16 border-b border-blue-600">
          <h1 className="text-xl font-bold">SwiftPay</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "bg-blue-800 text-white"
                    : "text-blue-100 hover:bg-blue-600"
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-blue-100 hover:bg-blue-600"
          >
            <svg
              className="mr-3 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 focus:outline-none"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {userTypeDisplay} Dashboard
              </h2>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {userTypeDisplay.charAt(0)}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
