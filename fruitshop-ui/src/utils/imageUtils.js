import { DEFAULT_FALLBACK_IMAGE } from "./cloudinary";

const BACKEND_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '') 
  : "https://fruitshop-production-f130.up.railway.app";

/**
 * Normalizes product image paths.
 * Handles:
 * 1. Empty/null paths (returns fallback)
 * 2. Full URLs (returns as-is)
 * 3. Local paths (prepends backend URL)
 */
export const getProductImage = (image) => {
  if (!image) return DEFAULT_FALLBACK_IMAGE;
  
  // If it's already a full URL or a data URI, return as-is
  if (image.startsWith('http') || image.startsWith('https') || image.startsWith('data:')) {
    return image;
  }
  
  // Normalize local path: ensure it starts with /uploads/
  let normalizedPath = image;
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  
  // Ensure the path includes /uploads/ if it's meant to be a local upload
  // This handles cases where only the filename was stored
  if (!normalizedPath.startsWith('/uploads/')) {
    normalizedPath = '/uploads' + normalizedPath;
  }
  
  // Prepend backend URL for local uploads
  const baseUrl = BACKEND_URL.replace(/\/+$/, ''); // Remove trailing slashes
  
  return `${baseUrl}${normalizedPath}`;
};
