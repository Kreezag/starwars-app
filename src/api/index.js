const mkRequestWithMethod = (method, url, body = {}) => () =>
  fetch(new Request(url, { method, body })).then(response => response.json());

const mkRequest = ({ url, data }) => ({
  get: mkRequestWithMethod('GET', url),
  post: mkRequestWithMethod('POST', url, data),
  put: mkRequestWithMethod('PUT', url, data),
  delete: mkRequestWithMethod('DELETE', url),
});

export { mkRequest };
