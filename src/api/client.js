function trimTrailingSlash(value) {
  return value?.replace(/\/+$/, "") ?? "";
}

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL);

export function getApiUrl(path) {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}
