import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const { data } = await authService.login(username, password);
            localStorage.setItem('token', data.token);
            notification.success({ message: 'Login successful!' });
            navigate("/")
        } catch (error) {
            notification.error({ message: 'Login failed!' });
        }
    };
                                
    return (
        <Form>
            <Form.Item label="Username">
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>
            <Form.Item label="Password">
                <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={handleLogin}>Login</Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;