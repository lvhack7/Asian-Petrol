import React, { useState } from 'react';
import { Form, Input, Button, notification, Card } from 'antd';
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
        <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f0f2f5'
      }}
    >
      <Card
        title={<h2 className='text-center text-xl py-2'>Вход</h2>}
        style={{
          width: 450,
          borderRadius: '10px',
          paddingTop: '8px',
          paddingBottom: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Имя пользователя">
            <Input
              value={username}
              size='large'
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Пароль">
            <Input.Password
              value={password}
              size='large'
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size='large' onClick={handleLogin} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    );
};

export default LoginForm;