export const getMetrics = async () => {
  const response = await fetch("http://127.0.0.1:8000/metrics");

  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }

  return response.json();
};