export function generateTenantId(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
  return `TNT-${datePart}-${randomPart}`;
}