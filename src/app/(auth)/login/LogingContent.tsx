"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/PrimaryButton";
import PasswordInput from "@/components/PasswordInput";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError(null);
    setIsLoading(true); // ✅ Start 
    const { email, password } = data;
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("Login response:", res);

 if (res?.ok) {
  toast.success("Logged in successfully!");
  router.push("/");
} else {
  const rawError = res?.error || "";

  if (rawError.includes("EC6B0000") || rawError.includes("ssl")) {
    toast.error("Secure connection failed. Please check your internet or try again later.");
  } else if (rawError.includes("No account")) {
    toast.error("No account found with this email.");
  } else if (rawError.includes("Incorrect password")) {
    toast.error("The password you entered is incorrect.");
  } else {
    toast.error("Login failed. Please try again.");
  }
}

  } catch (error) {
    console.error("Login error:", error);
   
    toast.error("Something went wrong during login. Please check your network and try again.");
  }

    setIsLoading(false); // ✅ Stop loading
    console.log(data)
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh]">
      <h1 className="text-xl font-semibold text-black">Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-sm w-full space-y-4 p-3 text-brandNeutral max-w-xl flex flex-col justify-center items-center"
      >
        {/* Email Field */}
        <div className=" w-full">
          <label className="ml-2">User Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            {...register("email", { required: "Email is required" })}
            className="my-input rounded-full w-full "
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <PasswordInput
          label="Password"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password?.message}
        />

        {loginError && (
          <div className="my-2 p-3 w-full max-w-xl text-center text-red-600 bg-red-100 rounded-md">
            {loginError}
          </div>
        )}

        {/* ✅ Login Button with Loading */}
        <PrimaryButton type="submit" disabled={isLoading} loading={isLoading}>
          Login
        </PrimaryButton>
      </form>

    
    </div>
  );
};

export default Login;
