const localFrontend = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);

const config = {
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV || localFrontend ? "http://127.0.0.1:8000/api" : "https://dspnaturals.com/api/public/api"),
};

export default config;
