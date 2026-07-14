
export const startCrawler = async (url: string) => {
  const response = await fetch(
    "http://127.0.0.1:8000/crawler/start",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  if (!response.ok) {
    throw new Error("Crawler failed");
  }

  return response.json();
};