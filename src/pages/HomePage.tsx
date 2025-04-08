import React, { useState, useEffect, useMemo } from "react";
import { getPosts, getUsers, getCurrentUser } from "../services/api";
import { useLikedPosts } from "../services/LikedPostsContext";
import "../App.css";

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedUsers: number[];
}

interface User {
  id: number;
  username: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Add currentUser
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { likedPosts, handleLike, setLikedPosts } = useLikedPosts(); // Add setLikedPosts

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
        const usersData = await getUsers();
        setUsers(usersData);
        // Fetch current user if logged in
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.log("No current user");
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };
    fetchData();
  }, []);

  // Sync likedPosts when posts and currentUser are available
  useEffect(() => {
    if (currentUser && posts.length > 0) {
      const likedPostIds = posts
        .filter(post => post.likedUsers?.includes(currentUser.id))
        .map(post => post.id);
      setLikedPosts(new Set(likedPostIds));
    }
  }, [posts, currentUser, setLikedPosts]);

  const getUsername = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Неизвестный";
  };

  const handleLikeClick = async (postId: number) => {
    if (!currentUser) {
      alert("Please log in to like posts");
      return;
    }
    try {
      const updatedPost = await handleLike(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error("Failed to update like in UI", error);
    }
  };

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
        getUsername(post.userId).toLowerCase().includes(authorFilter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [posts, titleFilter, authorFilter, users, sortOrder]);

  return (
    <div>
      <h1>Главная страница</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по заголовку"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Поиск по автору"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
        />
        <label htmlFor="sortOrder">Сортировать по дате: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Сначала новые</option>
          <option value="asc">Сначала старые</option>
        </select>
      </div>
      <div className="posts">
        <h2>Все посты</h2>
        {filteredAndSortedPosts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p><strong>Автор:</strong> {getUsername(post.userId)}</p>
            <p><strong>Дата:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            <button onClick={() => handleLikeClick(post.id)}>
              {currentUser && likedPosts.has(post.id) ? "Unlike ❤️" : "Like 👍"}
            </button>
            <p><strong>Likes:</strong> {post.likes || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;