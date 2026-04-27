import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

function getErrorMessage(error, fallbackMessage) {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  return fallbackMessage;
}

export async function loginUser(payload) {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not sign in right now.'));
  }
}

export async function registerUser(payload) {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not create account right now.'));
  }
}

export async function checkResetEmail(payload) {
  try {
    const { data } = await api.post('/auth/reset-password', payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not verify that email.'));
  }
}

export async function resetPassword(payload) {
  try {
    const { data } = await api.post('/auth/reset-password', payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not reset password right now.'));
  }
}

export async function getMajors() {
  try {
    const { data } = await api.get('/majors');
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not load majors right now.'));
  }
}

export async function getFavorites(userId) {
  try {
    const { data } = await api.get(`/favorites/${userId}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not load saved majors right now.'));
  }
}

export async function addFavorite(userId, majorId) {
  try {
    const { data } = await api.post('/favorites', { userId, majorId });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not save this major right now.'));
  }
}

export async function removeFavorite(userId, majorId) {
  try {
    const { data } = await api.delete(`/favorites/${userId}/${majorId}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not remove this major right now.'));
  }
}

export async function getQuizProfile(userId) {
  try {
    const { data } = await api.get(`/quiz-profile/${userId}`);
    return data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw new Error(getErrorMessage(error, 'Could not load your saved quiz profile.'));
  }
}

export async function saveQuizProfile(payload) {
  try {
    const { data } = await api.post('/quiz-profile', payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not save your quiz profile right now.'));
  }
}

export default api;
