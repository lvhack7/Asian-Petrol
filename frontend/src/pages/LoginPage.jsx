import React, { useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {

    if (localStorage.getItem("token")) {
        return <Navigate to={"/deals"} />
    }

    return <LoginForm />;
};

export default LoginPage;