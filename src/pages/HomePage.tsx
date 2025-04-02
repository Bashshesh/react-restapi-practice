import React, { useState, useEffect, useMemo } from "react";
import { getPosts, getUsers } from "../services/api";
import { useLikedPosts } from "/Users/bashshesh/react-restapi-practice/my-app/src/services/LikedPostsContext"; // Import the hook
import "../App.css";

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  likes: number;
}

interface User {
  id: number;
  username: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Get likedPosts and handleLike function from the context
  const { likedPosts, handleLike } = useLikedPosts();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsData = await getPosts();
        const usersData = await getUsers();
        setPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };
    fetchData();
  }, []);

  const getUsername = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Неизвестный";
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
            <p>
              <strong>Автор:</strong> {getUsername(post.userId)}
            </p>
            <p>
              <strong>Дата:</strong> {new Date(post.createdAt).toLocaleString()}
            </p>
            <button onClick={() => handleLike(post.id)}>
              {likedPosts.has(post.id) ? "Liked ❤️" : "Like 👍"}
            </button>
            <p>
              <strong>Likes:</strong> {post.likes || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
