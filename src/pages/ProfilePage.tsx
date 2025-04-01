import React, { useState, useEffect } from 'react';
import { getWeather, getPosts, deletePost, getCurrentUser, logoutUser, getUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import PostForm from '../components/PostForm';

const ProfilePage = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('London');
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]); // Состояние для списка пользователей
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchWeather();
    fetchPosts();
    fetchUsers(); // Получаем список пользователей
  }, [city]);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to fetch user', error);
      navigate('/login');
    }
  };

  const fetchWeather = async () => {
    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (error) {
      console.error('Failed to fetch weather', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user?.username || 'Guest'}!</p>
      <button onClick={handleLogout}>Logout</button>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      {weather && (
        <div>
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}

      <PostForm onPostCreated={fetchPosts} />

      <div className="posts">
        <h2>Your Posts</h2>
        {posts
          .filter((post) => post.userId === user?.id)
          .map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Created: {new Date(post.createdAt).toLocaleString()}</p>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          ))}
      </div>

      <div className="users">
        <h2>All Users</h2>
        {users.map((u) => (
          <p key={u.id}>{u.username} ({u.email})</p>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;