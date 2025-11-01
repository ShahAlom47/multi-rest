import { request } from "./apiRequests";


export const saveNotificationToken = async (token: string, tenantId: string) => {
  return request("POST", "/notification/save-token", { token, tenantId });
}