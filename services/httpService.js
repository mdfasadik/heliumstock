import { toast } from "react-toastify";

(function () {
  const originalFetch = fetch;
  fetch = function () {
    return originalFetch.apply(this, arguments).then((response) => {
      if (response.status > 404 && response.status < 500) {
        toast.error("Failed to load data");
        return Promise.reject("Failed to fetch");
      }
      return response;
    });
  };
})();

const get = async (url, headers) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...headers,
    },
  });
  return response.json();
};

const post = async (url, payload, headers = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      /* prettier-ignore */
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

const put = async (url, payload, headers) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      /* prettier-ignore */
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};
const del = async (url, headers) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      /* prettier-ignore */
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      ...headers,
    },
  });
  return response.json();
};

export default {
  get,
  post,
  put,
  del,
};
