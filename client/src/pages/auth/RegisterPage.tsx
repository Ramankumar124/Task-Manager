import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { setUserData } from "@/redux/features/authSlice";
import { IoPerson } from "react-icons/io5";
import toast from "react-hot-toast";
import { registerSchema } from "@/types/authSchema";
import { userSignup } from "@/Service/apiService";
interface RegisterFormInput {
  email: string;
  password: string;
  userName: string;
}

type RegisterRes = {
  message: string;
  data: {
    _id: string;
    userName: string;
    email: string;
    Tasks: object[];
    avatar: {
      public_id: string;
      url: string;
      _id: string;
    };
    createdAt: string;
    updatedAt: string;
  };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPassword, setIsPassword] = useState(true);

  function passwordToggle() {
    setIsPassword(!isPassword);
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      const response = (await userSignup(data)) as { data: RegisterRes };
      if (response?.data?.data) {
        toast.success(`${response?.data?.message}`);
        dispatch(setUserData(response?.data?.data));
        navigate("/dashboard");
        console.log(response.data.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">Sign Up</h1>
              <p className="text-gray-400 mt-2">
                Welcome Please enter your details.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <button
                type="button"
                onClick={() =>
                  (window.location.href = `${
                    import.meta.env.VITE_API_URL || "http://localhost:5000"
                  }/api/auth/google`)
                }
                className="w-full bg-white text-gray-800 border border-gray-300  px-4 py-2  rounded-lg! hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <img
                  src="/googleIcon.png"
                  alt="Google"
                  className="h-6 w-8 mr-2"
                />
                Continue with Google
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-500"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-500"></div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Name
                </label>
                <div>
                  <div className="relative">
                    <IoPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      {...register("userName")}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      placeholder="Enter Username"
                    />
                  </div>
                  {errors.userName && (
                    <p className=" text-red-500 error-message">
                      {errors.userName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      {...register("email")}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      placeholder="Enter Username or email"
                    />
                  </div>
                  {errors.email && (
                    <p className=" text-red-500 error-message">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={isPassword ? "password" : "text"}
                      {...register("password")}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      placeholder="Create a password"
                    />

                    {isPassword ? (
                      <Eye
                        onClick={passwordToggle}
                        className="absolute h-7  w-7 right-3 top-1/2 -translate-y-1/2 text-gray-400 "
                      />
                    ) : (
                      <EyeOff
                        onClick={passwordToggle}
                        className="absolute h-7  w-7 right-3 top-1/2 -translate-y-1/2 text-gray-400 "
                      />
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-red-500 error-message">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting..." : "Sign In"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>

              <p className="text-center text-gray-400 mt-2">
                Already have an account ? {"  "}
                <a
                  className="text-purple-400 hover:text-purple-300 no-underline hover:no-underline focus:no-underline"
                  href="/login"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right Section - Image/Preview */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://img.freepik.com/free-vector/neon-circuit-board-background_52683-28772.jpg?ga=GA1.1.144307226.1746463134&semt=ais_hybrid&w=740"
            alt="Auth Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/30  flex items-center justify-center">
            <div className="text-center p-8">
                     <div className="text-center p-8">
              <h2 className="text-3xl! font-bold text-white mb-4 flex flex-col items-center gap-1.5 ">
                Welcome Back To Task Sarthi
                <h1 className="text-2xl!  font-bold flex items-center">
                 Manage Task With Ai Power
                </h1>
              </h2>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
