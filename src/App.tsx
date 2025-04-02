import React from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import { LikedPostsProvider } from './services/LikedPostsContext';

function App() {
  return (
    <LikedPostsProvider>
      <Router>
        <div className="App">
          <Header />
          <header className="App-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </header>
          <Footer />
        </div>
      </Router>
    </LikedPostsProvider>
  );
}

export default App;