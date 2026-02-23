const API_BASE_URL = 'http://localhost:8080/api';

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Chyba serveru' }));
    return { status: 'REJECTED', reason: error.message ?? `HTTP ${response.status}` };
  }

  const data = await response.json().catch(() => null);
  return { status: 'SUCCESS', ...data };
}

export function get(path, token) {
  return request('GET', path, null, token);
}

export function post(path, body, token) {
  return request('POST', path, body, token);
}

export function put(path, body, token) {
  return request('PUT', path, body, token);
}

export function patch(path, body, token) {
  return request('PATCH', path, body, token);
}

export function del(path, token) {
  return request('DELETE', path, null, token);
}
