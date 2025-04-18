import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedUsers: number[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post<User>('/users', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post<User>('/login', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<User>('/me');
  return response.data;
};

export const logoutUser = async () => {
  await api.post('/logout');
};

export const editPost = async (postId: number, data: { title: string; content: string }) => {
  const response = await api.put<Post>(`/posts/${postId}`, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getWeather = async (city: string) => {
  const apiKey = 'f2d7906ac131e6db928f58ca7f090b00';
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  return response.data;
};

export const createPost = async (post: { title: string; content: string; userId: number }) => {
  const response = await api.post<Post>('/posts', {
    ...post,
    createdAt: new Date().toISOString(),
  });
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get<Post[]>('/posts');
  return response.data;
};

export const deletePost = async (postId: number) => {
  await api.delete(`/posts/${postId}`);
};

// Updated to use /api/ prefix
export const likePost = async (postId: number) => {
  const response = await api.post<Post>(`/api/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId: number) => {
  const response = await api.post<Post>(`/api/posts/${postId}/unlike`);
  return response.data;
};

export default api;