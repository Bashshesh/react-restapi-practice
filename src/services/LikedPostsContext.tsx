import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for context
interface LikedPostsContextType {
  likedPosts: Set<number>;
  handleLike: (postId: number) => void;
}

// Create the context
const LikedPostsContext = createContext<LikedPostsContextType | undefined>(undefined);

// Provider component
export const LikedPostsProvider = ({ children }: { children: ReactNode }) => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId); // Unlike if already liked
      } else {
        newSet.add(postId); // Like if not liked
      }
      return newSet;
    });
  };

  return (
    <LikedPostsContext.Provider value={{ likedPosts, handleLike }}>
      {children}
    </LikedPostsContext.Provider>
  );
};

// Custom hook to use the context
export const useLikedPosts = () => {
  const context = useContext(LikedPostsContext);
  if (!context) {
    throw new Error("useLikedPosts must be used within a LikedPostsProvider");
  }
  return context;
};
