import axios from "axios";

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl || baseUrl === "/") {
    return "";
  }
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function buildAuthHeaders(username, password) {
  if (!username || !password) {
    return {};
  }

  return {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`
  };
}

export function createApiClient(baseUrl, credentials) {
  return axios.create({
    baseURL: normalizeBaseUrl(baseUrl),
    headers: {
      ...buildAuthHeaders(credentials.username, credentials.password)
    }
  });
}

export async function executeRequest(baseUrl, credentials, request) {
  const client = createApiClient(baseUrl, credentials);
  return client.request({
    method: request.method,
    url: request.url,
    data: request.body
  });
}
