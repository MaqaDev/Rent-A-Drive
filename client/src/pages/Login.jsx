import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import { login as loginUser } from "../api/api.js";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginUser({
        email: data.email.trim(),
        password: data.password.trim(),
      });

      if (response.data.success) {
        login(response.data.data, response.data.token);
        toast.success("Login successful!");
        navigate(response.data.data.role === "admin" ? "/admin" : "/");
      }
    } catch (error) {
      toast.error("Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary to-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
        <h2 className='text-3xl font-bold text-primary mb-6 text-center'>
          Login
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Email
            </label>
            <input
              type='email'
              {...register("email", { required: "Email is required" })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              placeholder='john@example.com'
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              {...register("password", { required: "Password is required" })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              placeholder='••••••••'
            />
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-secondary text-primary font-bold py-2 rounded-lg hover:bg-accent transition disabled:opacity-50'>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
          <p className='text-sm text-gray-700 mb-2'>
            <strong>Demo Accounts:</strong>
          </p>
          <p className='text-xs text-gray-600'>
            Admin: admin@rentadrive.com / Admin1234!
          </p>
          <p className='text-xs text-gray-600'>
            User: user@rentadrive.com / User1234!
          </p>
        </div>

        <p className='text-center text-gray-600 mt-6'>
          Don't have an account?{" "}
          <a
            href='/register'
            className='text-secondary font-semibold hover:text-accent'>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};
