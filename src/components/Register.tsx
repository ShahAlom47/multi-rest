"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/PrimaryButton";
import PasswordInput from "@/components/PasswordInput";
import { RegisterData } from "@/Interfaces/userInterfaces";
import { registerUser } from "@/lib/allApiRequest/authRequest";
import toast from "react-hot-toast";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setRegisterError(null);
    setIsLoading(true);

    // Confirm password check
    if (data.password !== data.confirmPassword) {
      setRegisterError("Password and Confirm Password do not match");
      setIsLoading(false);
      return;
    }
const registerData: RegisterData = {
      name: data.name,
      email: data.email,
      password: data.password,
      tenantId: "super admin", // Replace with actual tenant ID
    };

    const res = await registerUser(registerData);
    if (!res.success) {
      toast.error(res.message || "Registration failed");
      setRegisterError(res.message || "Registration failed");
      setIsLoading(false);
      return;
    }
    toast.success("Registration successful! Please log in.");
    console.log("Register Data:", data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh]">
      <h1 className="text-xl font-semibold text-black mb-4">Register</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-sm w-full space-y-4 p-3 max-w-xl flex flex-col justify-center items-center"
      >
        {/* Name Field */}
        <div className="w-full">
          <label className="ml-2">Full Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            className="my-input rounded-full w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="w-full">
          <label className="ml-2">Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            {...register("email", { required: "Email is required" })}
            className="my-input rounded-full w-full"
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

        {/* Confirm Password Field */}
        <PasswordInput
          label="Confirm Password"
          register={register("confirmPassword", {
            required: "Confirm Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        {registerError && (
          <div className="my-2 p-3 w-full max-w-xl text-center text-red-600 bg-red-100 rounded-md">
            {registerError}
          </div>
        )}

        {/* Submit Button */}
        <PrimaryButton type="submit" disabled={isLoading} loading={isLoading}>
          Register
        </PrimaryButton>
      </form>
    </div>
  );
};

export default Register;
