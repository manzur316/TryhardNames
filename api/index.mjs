import app from '../apps/api/src/app.js';

function getApiPath(value) {
  if (Array.isArray(value)) {
    return value.join('/');
  }
  return typeof value === 'string' ? value : '';
}

function appendQuery(params, key, value) {
  if (Array.isArray(value)) {
    value.forEach((entry) => params.append(key, entry));
    return;
  }
  if (value != null) {
    params.append(key, String(value));
  }
}

export default function handler(req, res) {
  const apiPath = getApiPath(req.query?.apiPath);

  if (apiPath) {
    const params = new URLSearchParams();
    Object.entries(req.query || {}).forEach(([key, value]) => {
      if (key !== 'apiPath') {
        appendQuery(params, key, value);
      }
    });

    const query = params.toString();
    req.url = `/api/${apiPath}${query ? `?${query}` : ''}`;
  }

  return app(req, res);
}
