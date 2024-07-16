import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd';

const Login = () => {

    const onFinish = async (values) => {
        const response = await fetch("http://localhost:5500/api/login", {
            headers: {
                "Content-type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(values)
        })
        const json = await response.json()

        if (response.ok) {
            localStorage.setItem("token", json.token)
            window.location.reload()
        } else {
            alert(json.message)
        }
    }

    const onFinishFailed = async () => {
        console.log()
    }

    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Login"
                name="login"
                rules={[
                    {
                    required: true,
                    message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                    required: true,
                    message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default Login