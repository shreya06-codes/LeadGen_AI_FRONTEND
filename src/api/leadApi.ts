export const getLeads = async () => {
  const response = await fetch("http://127.0.0.1:8000/leads");

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
};