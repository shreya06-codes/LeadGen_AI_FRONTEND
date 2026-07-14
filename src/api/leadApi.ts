export const getLeads = async () => {
  const response = await fetch("http://127.0.0.1:8000/leads");

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
};
export const getLead = async (id: number) => {
  const response = await fetch(`http://127.0.0.1:8000/leads/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch lead");
  }

  return response.json();
};

const BASE_URL = "http://127.0.0.1:8000";

export const startCrawl = async (url: string) => {
  const response = await fetch(`${BASE_URL}/crawler/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to start crawl");
  }

  return response.json();
};

export const getCrawlHistory = async () => {
  const response = await fetch(`${BASE_URL}/crawler/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch crawl history");
  }

  return response.json();
};

export const getCrawlStats = async () => {
  const response = await fetch(`${BASE_URL}/crawler/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch crawl stats");
  }

  return response.json();
};

export const getCrawlStatus = async () => {
  const response = await fetch(`${BASE_URL}/crawler/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch crawl status");
  }

  return response.json();
};