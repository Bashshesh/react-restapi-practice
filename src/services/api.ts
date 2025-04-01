import axios from 'axios';

export interface Post {
    id: number;
    title: string;
    content: string;
    userId: number;
    createdAt: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
  }

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const registerUser = async (data: { username: string; email: string; password: string }) => {
  const response = await api.post<User>('/users', data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.get<User[]>('/users', {
    params: { email: data.email, password: data.password },
  });
  if (response.data.length > 0) return response.data[0];
  throw new Error('Invalid credentials');
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

export const createPost = async (post: { title: string; content: string; userId: number}) => {
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

export default api;