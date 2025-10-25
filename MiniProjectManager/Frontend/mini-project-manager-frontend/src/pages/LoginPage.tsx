import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
// import { useAuth } from '../context/AuthContext'; // Removed as LoginForm handles its own auth logic
// import { Link } from 'react-router-dom'; // Removed as LoginForm handles its own navigation

const LoginPage: React.FC = () => {
  // const { login } = useAuth(); // Removed

  return (
    <>
      <LoginForm />
    </>
  );
};

export default LoginPage;
