import React from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/api';
import '../App.css';

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await registerUser({ username: data.username, email: data.email, password: data.password });
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Username"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && <p>{errors.username.message}</p>}
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p>{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', { required: 'Confirm Password is required' })}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;