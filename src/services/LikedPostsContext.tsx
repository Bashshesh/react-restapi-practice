import { createContext, useContext, useState, ReactNode } from "react";
import { likePost, unlikePost } from "../services/api";

interface LikedPostsContextType {
  likedPosts: Set<number>;
  handleLike: (postId: number) => Promise<{ id: number; likes: number }>;
  setLikedPosts: (posts: Set<number>) => void;
}

const LikedPostsContext = createContext<LikedPostsContextType | undefined>(undefined);

export const LikedPostsProvider = ({ children }: { children: ReactNode }) => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = async (postId: number) => {
    try {
      const isLiked = likedPosts.has(postId);
      const updatedPost = isLiked ? await unlikePost(postId) : await likePost(postId);
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(postId); // Unlike
        } else {
          newSet.add(postId); // Like
        }
        return newSet;
      });
      return { id: updatedPost.id, likes: updatedPost.likes };
    } catch (error) {
      console.error("Failed to toggle like:", error);
      throw error;
    }
  };

  return (
    <LikedPostsContext.Provider value={{ likedPosts, handleLike, setLikedPosts }}>
      {children}
    </LikedPostsContext.Provider>
  );
};

export const useLikedPosts = () => {
  const context = useContext(LikedPostsContext);
  if (!context) {
    throw new Error("useLikedPosts must be used within a LikedPostsProvider");
  }
  return context;
};