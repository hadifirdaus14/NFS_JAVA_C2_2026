// One reusable wrapper around fetch. Every API call goes through here so the
// JWT header, JSON body encoding, JSON parsing and backend error handling
// live in ONE place instead of being repeated in every helper.
export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    token = '',
    body,
    headers = {}
  } = options;

  const requestHeaders = { ...headers };

  // Attach the JWT when we have one
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type when we're actually sending a JSON body
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  // Parse JSON if the server sent it
  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  // Surface the backend's own error message when the request fails
  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// Small helper to turn an object into a query string, skipping empty values.
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}
