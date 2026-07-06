import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const startCrawler = async (url: string) => {
  const response = await API.post("/crawler/start", {
    url,
  });

  return response.data;
};