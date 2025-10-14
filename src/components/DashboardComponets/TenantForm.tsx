// src/components/TenantForm.tsx
"use client";

import { TenantFormData } from "@/Interfaces/tenantInterface";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";


interface TenantFormProps {
  initialValues?: TenantFormData;       // Edit এর জন্য
  onSubmit: (data: TenantFormData) => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ initialValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TenantFormData>({
    defaultValues: initialValues || {
      name: "",
      slug: "",
      email: "",
      phone: "",
      domain: "",
      logoUrl: "",
      status: "pending",
    },
  });

  // Edit এর জন্য initialValues update হলে form reset
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const submitHandler: SubmitHandler<TenantFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 max-w ">
      <div>
        <label className="block font-bold">Restaurant Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-ful my-input"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-bold">Slug</label>
        <input
          {...register("slug", { required: "Slug is required" })}
          className="w-full my-input"
        />
        {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="block font-bold">Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full my-input"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-bold">Phone</label>
        <input
          {...register("phone")}
          className="w-full my-input"
        />
      </div>

      <div>
        <label className="block font-bold">Domain</label>
        <input
          {...register("domain", { required: "Domain is required" })}
          className="w-full my-input"
        />
        {errors.domain && <p className="text-red-500">{errors.domain.message}</p>}
      </div>

      <div>
        <label className="block font-bold">Logo URL</label>
        <input
          {...register("logoUrl")}
          className="w-full my-input "
        />
      </div>

      <div>
        <label className="block font-bold">Status</label>
        <select {...register("status")} className="w-full my-input">
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {initialValues ? "Update Tenant" : "Add Tenant"}
      </button>
    </form>
  );
};

export default TenantForm;
