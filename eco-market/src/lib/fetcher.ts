import { apiClient } from "./axios";

export const fetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url);


    return response.data;
  } catch (error) {
    console.error("Fetcher error:", error);
    throw error;
  }
};

export default fetcher;
