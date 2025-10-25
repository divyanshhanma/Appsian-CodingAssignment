import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
// import { useAuth } from '../context/AuthContext'; // Removed as RegisterForm handles its own auth logic
// import { Link } from 'react-router-dom'; // Removed as RegisterForm handles its own navigation

const RegisterPage: React.FC = () => {
  // const { register } = useAuth(); // Removed

  return (
    <>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
