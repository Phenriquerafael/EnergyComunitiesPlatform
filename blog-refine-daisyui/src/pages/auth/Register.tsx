// src/pages/auth/Register.tsx
import React from "react";
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Space } from "antd";
import { useNavigation } from "@refinedev/core";
import { UserService } from "../../services/userService";
import { console } from "inspector";
import { IUserDTO, IRoleDTO } from "../../interfaces";
import { roleService } from "../../services/roleService";

export const Register: React.FC = () => {
  const { push } = useNavigation();

const onFinish = async (values: IUserDTO) => {
    try {
        const role = await roleService.getByName("COMMUNITY_MANAGER") as IRoleDTO;
        
        await UserService.signup({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            role: role.id ? role.id : "",
        });
        message.success("Registration successful");
        push("/signUp");

    } catch (err) {
        message.error("Signup failed");
        push("/login")
    }
};

  return (
    <div style={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}>
      <Form name="register" style={{ maxWidth: 360, width: "100%" }} onFinish={onFinish} layout="vertical">
        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="First Name" />
        </Form.Item>

        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Last Name" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
          <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>

        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <a onClick={() => push("/login")}>Back to login</a>
        </Space>
      </Form>
    </div>
  );
};
