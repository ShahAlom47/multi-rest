import { RegisterData } from "@/Interfaces/userInterfaces";
import { request } from "./apiRequests";

export const registerUser = async (data: RegisterData) => {
  return request("POST", "/auth/register", { ...data });}