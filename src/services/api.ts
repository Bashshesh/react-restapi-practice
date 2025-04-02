import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Пароль не нужен в ответах после логина
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // Важно: позволяет отправлять и принимать cookie
});

export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post<User>('/users', data);
  return response.data;
};

// Обновленный логин: POST-запрос для создания сессии
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post<User>('/login', data);
  return response.data;
};

// Получение текущего пользователя по сессии
export const getCurrentUser = async () => {
  const response = await api.get<User>('/me');
  return response.data;
};

// Выход: завершение сессии
export const logoutUser = async () => {
  await api.post('/logout');
};

// Редактирование постов
export const editPost = async (postId: number, data: { title: string; content: string }) => {
  const response = await api.put<Post>(`/posts/${postId}`, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};

// Получение списка пользователей
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

export const likePost = async (postId: number) => {
  const response = await api.post<Post>(`/api/posts/${postId}/like`); // Add leading slash
  return response.data;
};

export default api;