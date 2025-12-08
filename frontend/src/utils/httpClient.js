// Global request tracker wrapping fetch and axios
import { store } from '../redux/store';
import { requestStarted, requestFinished } from '../redux/loadingSlice';
import { showNotification } from '../redux/notificationSlice';

// Wrap window.fetch with debounce to reduce flicker
let loaderTimer;
const DEBOUNCE_MS = 150;
const originalFetch = window.fetch.bind(window);
window.fetch = async (...args) => {
  clearTimeout(loaderTimer);
  loaderTimer = setTimeout(() => store.dispatch(requestStarted()), DEBOUNCE_MS);
  try {
    const response = await originalFetch(...args);
    if (!response.ok) {
      try {
        const data = await response.clone().json();
        const message = data?.message || `Request failed (${response.status})`;
        store.dispatch(showNotification({ message, severity: 'error' }));
      } catch (_) {
        store.dispatch(showNotification({ message: `Request failed (${response.status})`, severity: 'error' }));
      }
    }
    return response;
  } catch (error) {
    store.dispatch(showNotification({ message: error?.message || 'Network error', severity: 'error' }));
    throw error;
  } finally {
    clearTimeout(loaderTimer);
    // Ensure we decrement only after we incremented
    store.dispatch(requestFinished());
  }
};

// Try to wrap axios if present
try {
  // Dynamic require to avoid bundling error if axios not installed
  // eslint-disable-next-line global-require
  const axios = require('axios').default || require('axios');
  axios.interceptors.request.use((config) => {
    clearTimeout(loaderTimer);
    loaderTimer = setTimeout(() => store.dispatch(requestStarted()), DEBOUNCE_MS);
    return config;
  });
  axios.interceptors.response.use(
    (response) => {
      store.dispatch(requestFinished());
      if (response?.status && response.status >= 400) {
        store.dispatch(showNotification({ message: `Request failed (${response.status})`, severity: 'error' }));
      }
      return response;
    },
    (error) => {
      store.dispatch(requestFinished());
      const message = error?.response?.data?.message || error?.message || 'Network error';
      store.dispatch(showNotification({ message, severity: 'error' }));
      return Promise.reject(error);
    }
  );
} catch (_) {
  // axios not available; ignore
}

export {}; // module side-effects only


