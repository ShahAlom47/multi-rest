import axios from "axios";
import type { AxiosError } from "axios";

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  insId?: string;
  unreadCount?: number;
  data?: T;
  totalData?: number;
  currentPage?: number;
  totalPages?: number;
}

const getBaseURL = (): string => {
  // Example: detect tenant from window.location.host
  if (typeof window !== "undefined") {
    const host = window.location.host; // e.g., restu1.order.com
    return `http://${host}/api`;
  }
  // Default fallback for server-side or super admin
  return "http://localhost:3000/api";
};



export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  data?: Record<string, unknown> | FormData,
  isForm?: "formData",
  customHeaders?: Record<string, string>,
  tenantBaseURL?: string // Optional override
): Promise<IApiResponse<T>> => {
  try {
    const headers = {
      "Content-Type": isForm === "formData" ? "multipart/form-data" : "application/json",
      ...customHeaders,
    };

    // Auto add timestamps
    if (data && !(data instanceof FormData)) {
      const now = new Date().toISOString();
      if (method === "POST") {
        data = { ...data, createdAt: now, updatedAt: now };
      } else if (method === "PUT" || method === "PATCH") {
        data = { ...data, updatedAt: now };
      }
    }

    const response = await axios({
      method,
      url,
      data,
      headers,
      baseURL: tenantBaseURL || getBaseURL(), // dynamic tenant baseURL
      withCredentials: true,
    });

    return response.data as IApiResponse<T>;
  } catch (error: unknown) {
    let message = "Unknown error occurred";
    if (axios.isAxiosError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.data?.message) {
        message = axiosError.response.data.message;
      } else if (axiosError.message) {
        message = axiosError.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
    };
  }
};




// =========================
// export const request = async <T>(
//   method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
//   url: string,
//   data?: Record<string, unknown> | FormData,
//   isForm?: "formData",
//   customHeaders?: Record<string, string>,
//   tenantSubdomain?: string  // new parameter
// ): Promise<IApiResponse<T>> => {
//   try {
//     const baseURL = tenantSubdomain
//       ? `https://${tenantSubdomain}.tekzo.shop/api`
//       : window.location.origin + "/api";

//     const headers = {
//       "Content-Type":
//         isForm === "formData" ? "multipart/form-data" : "application/json",
//       ...customHeaders,
//     };

//     const api = axios.create({ baseURL, withCredentials: true });

//     // auto timestamp
//     if (data && !(data instanceof FormData)) {
//       const now = new Date().toISOString();
//       if (method === "POST") data = { ...data, createdAt: now, updatedAt: now };
//       else if (method === "PUT" || method === "PATCH") data = { ...data, updatedAt: now };
//     }

//     const response = await api({ method, url, data, headers });
//     return response.data as IApiResponse<T>;

//   } catch (error: unknown) {
//     let message = "Unknown error occurred";
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError<any>;
//       message = axiosError.response?.data?.message || axiosError.message;
//     } else if (error instanceof Error) {
//       message = error.message;
//     }
//     return { success: false, message };
//   }
// };
