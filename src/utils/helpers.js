import { MONTHS } from "./constants";

// Format numbers into currency format
export const fmt = (n, decimals = 0) =>
  new Intl.NumberFormat("en-IN", { 
    style: "currency", 
    currency: "INR", 
    maximumFractionDigits: decimals 
  }).format(n);

// Format numbers into shorter display format (e.g., 1000K, 100L)
export const fmtShort = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

// Generate unique ID for transactions
export const generateUniqueId = () => { 
  return Math.random().toString(36).slice(2, 9); 
};

// Get month label from date
export const getMonthLabel = (d) => {
  const dt = new Date(d);
  return MONTHS[dt.getMonth()];
};
