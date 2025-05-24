// src/pages/auth/Login.tsx
import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Space } from "antd";
import { useLogin, useNavigation } from "@refinedev/core";

export const Login: React.FC = () => {
  const { push } = useNavigation();
  const { mutate: login } = useLogin();
  
  const onFinish = (values: any) => {
    login(
      { email: values.email, password: values.password },
      {
        onSuccess: (result) => {
          if (result.success) {
            message.success("Login successful");
          } else {
            message.error("Login failed");
          }
        },
        onError: () => {
          message.error("Login failed");
        },
      }
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <Form name="login" style={{ maxWidth: 360, width: "100%" }} onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>

        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <a onClick={() => push("/change-password")}>Forgot password?</a>
          <a onClick={() => push("/register")}>Register now!</a>
        </Space>
      </Form>
    </div>
  );
};
