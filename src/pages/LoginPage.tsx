import React from 'react';
import { useForm } from 'react-hook-form';
import { loginUser, logoutUser } from '../services/api';
import '../App.css';
import { useNavigate } from 'react-router-dom';

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginUser(data); // Сессия создается на сервере
      navigate('/profile');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Данные в localStorage остаются, но сессия на сервере завершена
      navigate('/login');
    } catch (error) {
      alert('Logout failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">Login</button>
      </form>
      <button onClick={handleLogout}>Logout</button> {/* Кнопка выхода */}
    </div>
  );
};

export default LoginPage;