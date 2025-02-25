import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login to Your Account
      </h2>

      <LoginForm />
    </div>
  );
};

export default Login;
