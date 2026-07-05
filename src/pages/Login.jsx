/* done by: Alex 3 July 2026 */

import { Card, Form, Input, Button, Typography, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import apiAuth from "./apiAuth";
import api from "../api";

const { Title, Text } = Typography;

export default function Login({ openPage, setCurrentUser }) {

        const onFinish = async (values) => {

            try {

                const loginResponse = await apiAuth.post("/login", {
                    username: values.username,
                    password: values.password
                    
                });
                const meResponse = await apiAuth.get("/me");
                //test line
                console.log(meResponse.data);
                const usersResponse = await api.get('/User');
                const loggedInUser = usersResponse.data.list.find(
                (user) => user.UserID === meResponse.data.id);

                setCurrentUser(loggedInUser);

                message.success("Login successful!");

                openPage("home");

            }
            
            catch(error) {

                console.log(error);

                message.error("Invalid username or password.");
                console.log("Sent:", error.config?.data);

            };

        };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f5f7fa"
            }}
        >
            <Card
                style={{
                    width: 400,
                    borderRadius: 12
                }}
            >
                <Title level={2} style={{ textAlign: "center" }}>
                    Entertainment Guild
                </Title>

                <Text
                    style={{
                        display: "block",
                        textAlign: "center",
                        marginBottom: 25
                    }}
                >
                    Welcome Back
                </Text>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your username"
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter username"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password"
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Checkbox>
                            Remember Me
                        </Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Login
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
