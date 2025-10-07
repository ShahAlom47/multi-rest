"use client";

import React, { useState, useEffect } from "react";
import { Users } from "@/Interfaces/userInterfaces";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import {
  getUserInfo,
  updateUserInfo,
} from "@/lib/allApiRequest/userRequest/userRequest";
import Loading from "@/app/loading";
import Error from "next/error";
import UploadProfilePhoto from "@/components/UploadProfilePhoto";
import toast from "react-hot-toast";
import Link from "next/link";
import {  FaArrowRight } from "react-icons/fa";

const Settings: React.FC = () => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user info from API
  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useQuery<Users, Error>({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new globalThis.Error("User email not found");
      const res = await getUserInfo(user.email);
      return res?.data as Users;
    },
    enabled: !!user?.email, // Only run query if email exists
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Users>>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    newsletter: false,
  });

  // Sync form state when userData arrives
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipcode: userData.zipcode || "",
        country: userData.country || "",
        newsletter: userData.newsletter || false,
      });
    }
  }, [userData]);

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }));
  };

  // Check if form has changes compared to userData
  const hasChanges = () => {
    if (!userData) return false;
    return (
      formData.name !== (userData.name || "") ||
      formData.phone !== (userData.phone || "") ||
      formData.address !== (userData.address || "") ||
      formData.city !== (userData.city || "") ||
      formData.state !== (userData.state || "") ||
      formData.zipcode !== (userData.zipcode || "") ||
      formData.country !== (userData.country || "") ||
      formData.newsletter !== (userData.newsletter || false)
    );
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges()) {
      toast.error("No changes to save.");
      return;
    }

    try {
      if (!userData?.email) throw new globalThis.Error("User email not found");
      setIsSubmitting(true);

      const res = await updateUserInfo(userData.email, {
        ...formData,
        emailVerificationToken:
          userData.emailVerificationToken === null
            ? undefined
            : userData.emailVerificationToken,
      });
      if (res?.success) {
        toast.success("Settings updated successfully!");
        refetch();
      } else {
        toast.error("Failed to update settings. Try again.");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Error
        statusCode={500}
        title="Failed to load user settings. Please refresh."
      />
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-2 text-gray-600">
        Manage your account information and preferences.
      </p>

      <div className="mt-4">
        <UploadProfilePhoto initialImage={userData?.image || ""} />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="my-input"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">
            Email (cannot change)
          </label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="my-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="my-input"
            placeholder="Your phone number"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="my-input"
            placeholder="Your address"
          />
        </div>

        {/* City, State, Zipcode, Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="my-input"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="my-input"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Zipcode</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="my-input"
              placeholder="Zipcode"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="my-input"
              placeholder="Country"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            id="newsletter"
          />
          <label htmlFor="newsletter" className="font-medium">
            Subscribe to newsletter
          </label>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn-base mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div
        className={`border-l-4 border-blue-500 bg-blue-100 text-blue-950 p-4 rounded-md  my-4`}
      >
        <p className="text-sm">
          🔒 To change your password, please use the `Forgot Password`` option.
          You cannot change it directly from the settings page.
        </p>
        <p className="text-sm mt-1">
          🔒 পাসওয়ার্ড পরিবর্তন করতে, `ফরগট পাসওয়ার্` অপশন ব্যবহার করুন।
          সেটিংস পেজ থেকে সরাসরি পরিবর্তন করা সম্ভব নয়।
        </p>
        <Link href="/forget-password" className="text-blue-600 underline mt-3 flex gap-2 items-center ml-5">
        <FaArrowRight></FaArrowRight> Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Settings;
