import api from "../api";
import CryptoJS from "crypto-js";
import { Card, Form, Input, Button, Typography, message } from "antd";

const { Title } = Typography;

export default function CreateAccount() {

    const onFinish = async (values) => {

        if (values.password !== values.confirmPassword) {
            message.error("Passwords do not match.");
            return;
        }

        const salt = CryptoJS.lib.WordArray.random(16).toString();
        const hashPW = CryptoJS.SHA256(salt + values.password).toString();

        /*api.post("/Patrons", {
            Email: values.email,
            Name: values.name,
            Salt: salt,
            HashPW: hashPW
        })
        .then((response) => {

            console.log(response.data);

            message.success("Account created!");

        })
        .catch((error) => {

            console.log(error.response);

            message.error("Create user failed.");

        });

    }; */
        try {

        const userResponse = await api.post("/User", {
            UserName: values.username,
            Email: values.email,
            Name: values.name,
            IsAdmin: 0,
            Salt: salt,
            HashPW: hashPW
        });

        
        const patronResponse = await api.post("/Patrons", {
            Email: values.email,
            Name: values.name,
            Salt: salt,
            HashPW: hashPW
        });

        message.success("Account created successfully!");

        } catch (error) {
            

            message.error("Failed to create user.");
            message.error("Public account registration is not available. Please contact an administrator.")
            
            return;

        }
    };

    return (

        <Card style={{ width: 450, margin: "40px auto" }}>

            <Title level={2}>Create Account</Title>

            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your full name."
                        },
                        {
                            min: 2,
                            message: "Name must be at least 2 characters."
                        },
                        {
                            max: 50,
                            message: "Name cannot exceed 50 characters."
                        }
                    ]}
                >
                    <Input placeholder="e.g. Alex Tan" />
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a username."
                        },
                        {
                            min: 3,
                            message: "Username must be at least 3 characters."
                        },
                        {
                            max: 20,
                            message: "Username cannot exceed 20 characters."
                        }
                    ]}
                >
                    <Input placeholder="e.g. alex123" />
                </Form.Item>

                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your email address."
                        },
                        {
                            type: "email",
                            message: "Please enter a valid email address."
                        }
                    ]}
                >
                    <Input placeholder="e.g. alex@email.com" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[{ required: true }]}
                >
                    <Input.Password />
                </Form.Item>

                <Button
                    htmlType="submit"
                    type="primary"
                    block
                >
                    Create Account
                </Button>

            </Form>

        </Card>

    );

}