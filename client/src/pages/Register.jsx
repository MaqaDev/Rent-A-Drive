import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.js";
import { register as registerUser } from "../api/api.js";

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        login(response.data.data, response.data.token);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary to-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8'>
        <h2 className='text-3xl font-bold text-primary mb-6 text-center'>
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Full Name
            </label>
            <input
              type='text'
              {...register("name", { required: "Name is required" })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              placeholder='John Doe'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>

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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              placeholder='••••••••'
            />
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Confirm Password
            </label>
            <input
              type='password'
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary'
              placeholder='••••••••'
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-secondary text-primary font-bold py-2 rounded-lg hover:bg-accent transition disabled:opacity-50'>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className='text-center text-gray-600 mt-6'>
          Already have an account?{" "}
          <a
            href='/login'
            className='text-secondary font-semibold hover:text-accent'>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};
