export const getGoogleLoginUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base.replace(/\/$/, "")}/auth/google`;
};
