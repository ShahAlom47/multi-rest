export interface Tenant {
  _id?: string;              // MongoDB ObjectId
  tenantId: string;           // Custom ID, e.g., TNT-20251011-0001
  name: string;               // Restaurant name
  slug: string;               // unique subdomain, e.g., restaurantone
  email: string;              // Owner/Restaurant email
  phone?: string;             // Optional contact number
  domain: string;             // Full domain, e.g., orders.restaurantone.com
  logoUrl?: string;           // Optional logo URL
  theme?: {                   // Optional theme customization
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  status?: "active" | "pending" | "suspended"; // Tenant lifecycle
  createdAt?: Date;
  updatedAt?: Date;
}
