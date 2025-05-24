// src/pages/auth/ChangePassword.tsx
import React from "react";
import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Space } from "antd";
import { useNavigation } from "@refinedev/core";

export const ChangePassword: React.FC = () => {
  const { push } = useNavigation();

  const onFinish = (values: any) => {
    message.success("If email exists, reset link will be sent");
    push("/login");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <Form name="changePassword" style={{ maxWidth: 360, width: "100%" }} onFinish={onFinish} layout="vertical">
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Reset Password
          </Button>
        </Form.Item>

        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <a onClick={() => push("/login")}>Back to login</a>
        </Space>
      </Form>
    </div>
  );
};
