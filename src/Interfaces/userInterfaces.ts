import { ObjectId } from 'mongodb';
// types/user.ts

export type UserRole = "user" | "admin" | "rider" | "super_admin";

export interface User {
  _id?: string |ObjectId;                     // MongoDB ObjectId
  name: string;                     // Full name
  email: string;                    // Unique email address
  password?: string;            // Encrypted password
  phone?: string;                   // Phone number
  image?: string| null;               // Profile photo
  role: UserRole;             // User role    // user | admin | rider | super_admin
  verified?:boolean;              
      emailVerificationToken?: string; // For email verification
  tenantId?: string;                // Restaurant/shop ID (for multi-tenant)
  address?: string;                 // Full address
  city?: string;                    // City name
  country?: string;                 // Country name
  gender?: "male" | "female" | "other"; // Optional gender
  dateOfBirth?: Date;               // For user verification
  nidOrPassport?: string;           // Rider or admin identity verification
  walletBalance?: number;           // For user payments or rider earnings
  rating?: number;                  // For rider/user review system
  totalOrders?: number;             // How many orders user placed / handled
  lastLogin?: Date;                 // Track last login
  isVerified: boolean;              // Email / KYC verified
  isActive: boolean;                // Account status
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  deviceInfo?: {
    deviceId?: string;
    fcmToken?: string;
    platform?: "web" | "android" | "ios";
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
