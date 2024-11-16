import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// used a fallback machenism for fetching IP details with free api and paid one.
export const fetchIpDetails = async (ip) => {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  } catch (error) {
    console.error("Free API failed:", error.message);
    try {
      const paidApiResponse = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IP_TOKEN}`);
      return paidApiResponse.data;
    } catch (fallbackError) {
      console.error("Paid API also failed:", fallbackError.message);
      return null;
    }
  }
};
