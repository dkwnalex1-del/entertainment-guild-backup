import { useState, useEffect, useRef, } from "react";
import {Row,Col,Card,Modal,Form,Input,Button,Checkbox,message,} from "antd";
import api from "../api";
import {UserAddOutlined,EditOutlined,DeleteOutlined,} from "@ant-design/icons";
import CryptoJS from "crypto-js";

function Users() {

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [users, setUsers] = useState([]);
    const editFormRef = useRef(null);
    
    const [selectedUser, setSelectedUser] = useState(null);
    
    useEffect(() => {

    const loadUsers = async () => {

        try {

            const response = await api.get("/User");

            setUsers(response.data.list);

        } catch (error) {

            console.log(error);

        }

            };

            loadUsers();

        }, []);

    const handleCreateUser = async (values) => {

        try {

            const salt = CryptoJS.lib.WordArray.random(16).toString();

            const hashPW = CryptoJS.SHA256(
                salt + values.password
            ).toString();

            await api.post("/User", {

                UserName: values.username,
                Email: values.email,
                Name: values.name,
                IsAdmin: values.isAdmin ? 1 : 0,
                Salt: salt,
                HashPW: hashPW,

            });

            await api.post("/Patrons", {

                Email: values.email,
                Name: values.name,
                Salt: salt,
                HashPW: hashPW,

            });

            message.success("User created successfully!");

            form.resetFields();
            setCreateOpen(false);

        } catch (error) {

            console.log(error.response);

            message.error("Unable to create user.");

        }

    };

    const handleEditUser = async (values) => {

        try {

            await api.patch(`/User/${selectedUser.UserID}`, {

                UserName: values.username,
                Email: values.email,
                Name: values.name,
                IsAdmin: values.isAdmin ? 1 : 0,

            });

            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.UserID === selectedUser.UserID
                        ? {
                            ...user,
                            UserName: values.username,
                            Email: values.email,
                            Name: values.name,
                            IsAdmin: values.isAdmin ? 1 : 0,
                        }
                        : user
                )
            );

            message.success("User updated.");

            setEditOpen(false);

        } catch (error) {

            console.log(error.response);

            message.error("Unable to update user.");

        }

    };

    const handleDeleteUser = async (user) => {

        try {

            await api.delete(`/User/${user.UserID}`);

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (u) => u.UserID !== user.UserID
                )
            );

            message.success("User deleted.");

        } catch (error) {

            console.log(error.response);

            message.error("Unable to delete user.");

        }

    };

    return (

        <section className="planned-page">

            <h2>Manage User Accounts</h2>

            <Row gutter={24}>

                <Col span={8}>
                    <Card
                        hoverable
                        style={{ textAlign: "center", height: 250 }}
                        onClick={() => setCreateOpen(true)}
                    >
                        <UserAddOutlined style={{ fontSize: 50 }} />

                        <h2>Create User</h2>

                        <p>
                            Create customer or administrator accounts.
                        </p>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        hoverable
                        style={{ textAlign: "center", height: 250 }}
                        onClick={() => setEditOpen(true)}
                    >
                        <EditOutlined style={{ fontSize: 50 }} />

                        <h2>Edit User</h2>

                        <p>
                            Modify existing user accounts.
                        </p>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        hoverable
                        style={{ textAlign: "center", height: 250 }}
                        onClick={() => setDeleteOpen(true)}
                    >
                        <DeleteOutlined style={{ fontSize: 50 }} />

                        <h2>Delete User</h2>

                        <p>
                            Remove user accounts.
                        </p>
                    </Card>
                </Col>

            </Row>
            <Modal
                title="Create User"
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleCreateUser}
                >

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="isAdmin"
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Administrator
                        </Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Create User
                    </Button>

                </Form>
            </Modal>

            <Modal
                title="Edit User"
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                footer={null}
            >
                {users.map((user) => (

                <Card
                    key={user.UserID}
                    hoverable
                    style={{ marginBottom: 10 }}
                    onClick={() => {

                        setSelectedUser(user);

                        editForm.setFieldsValue({

                            name: user.Name,
                            username: user.UserName,
                            email: user.Email,
                            isAdmin: Boolean(user.IsAdmin),

                        });

                        editFormRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });

                    }}
                >

                    <strong>{user.Name}</strong>

                    <br />

                    {user.Email}

                </Card>

            ))}
            <div ref={editFormRef}>
            <Form
                layout="vertical"
                form={editForm}
                onFinish={handleEditUser}
                >

                    <Form.Item
                        label="Name"
                        name="name"
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
                        label="Email"
                        name="email"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="isAdmin"
                        valuePropName="checked"
                    >
                        <Checkbox>
                            Administrator
                        </Checkbox>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Save Changes
                    </Button>

                </Form>
            </div>
            </Modal>

            <Modal
                title="Delete User"
                open={deleteOpen}
                onCancel={() => setDeleteOpen(false)}
                footer={null}
            >
                {users.map((user) => (

            <Card
                key={user.UserID}
                hoverable
                style={{ marginBottom: 10 }}
                onClick={() => {

                    Modal.confirm({

                        title: "Delete User",

                        content: `Are you sure you want to delete ${user.Name}?`,

                        okText: "Delete",

                        okType: "danger",

                        cancelText: "Cancel",

                        onOk: () => handleDeleteUser(user),

                        });

                }}
            >

                <strong>{user.Name}</strong>

                <br />

                {user.Email}

            </Card>

        ))}
            </Modal>

        </section>

    );

}

export default Users;