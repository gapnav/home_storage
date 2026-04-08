import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const useHello = () =>
  useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/hello`);
      if (!res.ok) throw new Error("API request failed");
      const json = await res.json();
      return json.data as { message: string };
    },
  });
