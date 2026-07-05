/* Done by: Alex , written on 20 June 2026*/

import { useEffect } from "react";
import { Card, Button, Form, Input, message } from "antd";
import api from "../api";

function Account({ currentUser }) {

    const [form] = Form.useForm();

    useEffect(() => {

        const loadAccount = async () => {

            try {

                const patronsResponse = await api.get("/Patrons");

                const patron = patronsResponse.data.list.find(
                    (p) =>
                        p.Email.toLowerCase() === currentUser.Email.toLowerCase()
                );

                if (!patron) {
                    message.error("Patron not found.");
                    return;
                }

                const toResponse = await api.get("/TO");

                const customer = toResponse.data.list.find(
                    (record) => record.PatronId === patron.UserID
                );

                form.setFieldsValue({

                    name: currentUser.Name,
                    email: currentUser.Email,
                    username: currentUser.UserName,

                    phoneNumber: customer?.PhoneNumber,
                    streetAddress: customer?.StreetAddress,
                    suburb: customer?.Suburb,
                    state: customer?.State,
                    postCode: customer?.PostCode,

                });

            } catch (error) {

                console.log(error);

                message.error("Unable to load account.");

            }

        };

        if (currentUser) {
            loadAccount();
        }

    }, [currentUser, form]);

            const handleSave = async (values) => {

            try {
                await api.patch(`/User/${currentUser.UserID}`, {

            Name: values.name || null,
            Email: values.email || null,
            UserName: values.username || null,

            });

            message.success("Account updated.");

            } catch (error) {

                console.log(error);

                message.error("Unable to save changes.");

            }

        };

    return (
        <section className="planned-page">

            <h2>Manage Account</h2>

            <Card>

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSave}
                >

                    <Form.Item
                        label="Name"
                        name="name"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Street Address"
                        name="streetAddress"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Suburb"
                        name="suburb"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="State"
                        name="state"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Post Code"
                        name="postCode"
                    >
                        <Input />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Save Changes
                    </Button>

                </Form>

            </Card>

        </section>
    );
}

export default Account;