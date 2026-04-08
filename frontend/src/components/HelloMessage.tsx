import { useHello } from "../services/helloService";

export const HelloMessage = () => {
  const { data, isLoading, isError } = useHello();

  if (isLoading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Failed to connect to API.</p>;
  }

  return (
    <p className="text-green-600 font-semibold text-lg">{data?.message}</p>
  );
};
