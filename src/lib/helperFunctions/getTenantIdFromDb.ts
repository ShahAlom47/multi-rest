import { getTenantCollection } from "../database/db_collections";

export const extractSubdomain = (host: string): string | null => {
  const cleanHost = host.split(":")[0].toLowerCase();
  const parts = cleanHost.split(".");

  if (cleanHost.includes("localhost") || cleanHost.includes("lvh.me")) {
    return parts.length > 2 ? parts[0] : null;
  } else if (parts.length > 2) {
    return parts[0];
  }
  return null;
};

export const getTenantBySubdomain = async (host: string) => {
  const subdomain = extractSubdomain(host);
  if (!subdomain) return null;

  const tenantCollection = await getTenantCollection();
  const tenant = await tenantCollection.findOne({ slug: subdomain });
  return tenant;
};
