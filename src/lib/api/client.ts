import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 개발 환경 임시 헤더 (백엔드 연결 테스트용)
  if (process.env.NODE_ENV === 'development') {
    config.headers['x-organization-id'] = process.env.NEXT_PUBLIC_DEV_ORG_ID ?? '';
    config.headers['x-user-role'] = process.env.NEXT_PUBLIC_DEV_ROLE ?? 'ADMIN';
    config.headers['x-user-id'] = process.env.NEXT_PUBLIC_DEV_USER_ID ?? '';
  }

  return config;
});