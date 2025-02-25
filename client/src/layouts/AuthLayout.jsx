import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SwiftPay</h1>
          <p className="text-white text-opacity-80">
            Your Mobile Financial Service
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <Outlet />
        </div>
        <div className="text-center mt-6">
          <p className="text-white text-opacity-70 text-sm">
            &copy; {new Date().getFullYear()} SwiftPay. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
