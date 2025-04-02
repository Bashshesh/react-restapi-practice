import React from 'react';
import { useForm } from 'react-hook-form';
import { createPost } from '../services/api';

type PostFormData = {
  title: string;
  content: string;
};

const PostForm = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<PostFormData>();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPost({
        ...data,
        userId: user.id,
      });
      onPostCreated();
    } catch (error) {
      alert('Failed to create post');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Post title"
        {...register('title', { required: 'Title is required' })}
      />
      {errors.title && <p>{errors.title.message}</p>}
      <textarea
        placeholder="Post content"
        {...register('content', { required: 'Content is required' })}
      />
      {errors.content && <p>{errors.content.message}</p>}
      <button type="submit" className='post-button'>Create Post</button>
    </form>
  );
};

export default PostForm;