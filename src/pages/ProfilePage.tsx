import React, { useState, useEffect } from 'react';
import { getWeather, getPosts, deletePost } from '../services/api';
import '../App.css';
import PostForm from '../components/PostForm';

const ProfilePage = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('London');
  const [posts, setPosts] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchWeather();
    fetchPosts();
  }, [city]);

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

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user.username || 'Guest'}!</p>
      
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
          .filter(post => post.userId === user.id)
          .map(post => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Created: {new Date(post.createdAt).toLocaleString()}</p>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProfilePage;