import axios from 'axios';
import { getToken, triggerSessionExpired, isAuthError } from './auth';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message as string | undefined;
    const requestUrl = error.config?.url as string | undefined;

    if (status && isAuthError(status, message, requestUrl)) {
      triggerSessionExpired();
    }

    return Promise.reject(error);
  }
);

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  userId: {
    userName: string;
  };
  tags: string[];
}

export interface SharedBrain {
  userName: string;
  content: Content[];
}

export const signup = async (userName: string, password: string) => {
  const response = await api.post('/signup', { userName, password });
  return response.data;
};

export const login = async (userName: string, password: string) => {
  const response = await api.post('/login', { userName, password });
  return response.data;
};

export const createContent = async (title: string, link: string, type: string) => {
  const response = await api.post('/createContent', { title, link, type });
  return response.data;
};

export const viewContent = async (): Promise<{ content: Content[] }> => {
  const response = await api.get('/viewContent');
  return response.data;
};

export const deleteContent = async (contentId: string) => {
  const response = await api.delete('/deleteContent', { data: { contentId } });
  return response.data;
};

export interface ShareStatus {
  shared: boolean;
  hash: string | null;
  createdAt: string | null;
}

export const shareBrain = async (share: boolean) => {
  const response = await api.post('/brain/share', { share });
  return response.data as { hash?: string; message?: string };
};

export const getShareStatus = async (): Promise<ShareStatus> => {
  const response = await api.get('/brain/share/status');
  return response.data;
};

export const getSharedBrain = async (sharelink: string): Promise<SharedBrain> => {
  const response = await axios.get(`${API_BASE_URL}/brain/${sharelink}`);
  return response.data;
};
