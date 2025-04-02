import React, { useState, useEffect } from 'react';
import { getWeather, getPosts, deletePost, getCurrentUser, logoutUser, getUsers, editPost, likePost} from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import PostForm from '../components/PostForm';
import { title } from 'process';

const ProfilePage = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('London');
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<{ id: number; title: string; content: string } | null>(null);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
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

      const likesData = data.reduce((acc: { [key: number]: number }, post) => {
        acc[post.id] = post.likes || 0;
        return acc;
      }, {});

      setLikes(likesData);
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

  const openEditModal = (post: { id: number; title: string; content: string }) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
  };

  const handleLike = async (postId: number) => {
    if (likedPosts.has(postId)) return; // Если уже лайкали — не даём лайкать снова

    try {
      await likePost(postId); // API-запрос на сервер
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: (prevLikes[postId] || 0) + 1,
      }));
      setLikedPosts((prev) => new Set(prev).add(postId)); // Запоминаем лайкнутый пост
    } catch (error) {
      console.error('Failed to like post', error);
    }
  };

  const handleSaveEdit = async (updatedPost: { title: string; content: string }) => {
    if (currentPost) {
      try {
        const updatedPostWithTime = { ...updatedPost, updatedAt: new Date().toISOString() };
        await editPost(currentPost.id, updatedPostWithTime);
        fetchPosts();
        closeEditModal();
      } catch (error) {
        console.error('Failed to save post', error);
      }
    }
  };

  const handlePostEdit = async (postId: number, updatedPost: { title: string; content: string }) => {
    try {
      await editPost(postId, updatedPost);
      fetchPosts();
    } catch (error) {
      console.error('Failed to edit post', error);
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
    <div className="profile-page">
      <h1>Profile</h1>
      <p>Welcome, {user?.username || 'Guest'}!</p>
      <button onClick={handleLogout} className='post-button'>Logout</button>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className='post-form'
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
              <p>Updated: {new Date(post.updatedAt).toLocaleString()}</p>
              <p>Likes: {likes[post.id] || 0}</p>
              <button
                onClick={() => handleLike(post.id)}
                disabled={likedPosts.has(post.id)}
              >
                {likedPosts.has(post.id) ? "Liked ❤️" : "Like 👍"}
              </button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
              <button onClick={() => openEditModal(post)}>Edit</button>
            </div>
          ))}
      </div>


      <div className="users">
        <h2>All Users</h2>
        {users.map((u) => (
          <p key={u.id}>{u.username} ({u.email})</p>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Post</h2>
            <input
              type="text"
              value={currentPost?.title || ''}
              onChange={(e) => setCurrentPost((prev) => prev ? { ...prev, title: e.target.value } : null)}
            />
            <textarea
              value={currentPost?.content || ''}
              onChange={(e) => setCurrentPost((prev) => prev ? { ...prev, content: e.target.value } : null)}
            />
            <button onClick={() => currentPost && handleSaveEdit({ title: currentPost.title, content: currentPost.content })}>Save</button>
            <button onClick={closeEditModal}>Cancel</button>
          </div>
        </div>
      )}



    </div>
  );
};

export default ProfilePage;