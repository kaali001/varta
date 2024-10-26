export default function getBrowserType() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("chrome") || userAgent.includes("chromium")) {
    if (userAgent.includes("edg")) {
      return "Edge";
    }
    return "Chrome";
  } else if (userAgent.includes("firefox")) {
    return "Firefox";
  } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return "Safari";
  } else if (userAgent.includes("opr") || userAgent.includes("opera")) {
    return "Opera";
  }

  return "Unknown";
}
