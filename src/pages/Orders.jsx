
import { useEffect, useState } from "react";
import { Card, Empty, message, Button, Modal, Form, Input } from "antd";
import api from "../api";

function Orders({ currentUser }) {

    const [orders, setOrders] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [form] = Form.useForm();


    useEffect(() => {

        const loadOrders = async () => {

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

                if (!customer) {
                    setOrders([]);
                    return;
                }

                const ordersResponse = await api.get("/Orders");

                const myOrders = ordersResponse.data.list.filter(
                    (order) => order.Customer === customer.CustomerID
                );

                 
                const stocktakeResponse = await api.get("/Stocktake?limit=1000");
                const productsResponse = await api.get("/Product?limit=1000");

                const ordersWithProducts = myOrders.map((order) => {

                const items = order["Stocktake List"]
                .map((stockItem) => {

                            const stock = stocktakeResponse.data.list.find(
                                (s) => s.ItemId === stockItem.ItemId
                            );

                            if (!stock) return null;

                            const product = productsResponse.data.list.find(
                                (p) => p.ID === stock.ProductId
                            );

                            return product?.Name;

                        })
                        .filter(Boolean);

                    return {
                        ...order,
                        Items: items,
                    };

                });

                setOrders(ordersWithProducts);

            } catch (error) {

                console.log(error);

                message.error("Unable to load orders.");

            }

        };

        loadOrders();

    }, []);

    const handleSaveOrder = async (values) => {

            try {

                await api.patch(`/Orders/${selectedOrder.OrderID}`, {

                    StreetAddress: values.streetAddress || null,
                    Suburb: values.suburb || null,
                    State: values.state || null,
                    PostCode: values.postCode
                        ? Number(values.postCode)
                        : null,

                });
                setOrders((previousOrders) =>
                    previousOrders.map((order) =>
                    order.OrderID === selectedOrder.OrderID
                ? {
                  ...order,
                  StreetAddress: values.streetAddress,
                  Suburb: values.suburb,
                  State: values.state,
                  PostCode: Number(values.postCode),
                }
                    : order));

                message.success("Order updated.");

                setEditOpen(false);

            } catch (error) {

                console.log(error.response?.data);
                console.log(error.response);

                message.error("Unable to update order.");

            }

        };

    return (
        

        <section className="planned-page">
            <h2>My Orders</h2>

            {orders.length === 0 ? (
                <Empty description="No orders found." />
            ) : (
                orders.map((order) => (
                    <Card key={order.OrderID}
                    style={{ marginBottom: 15 }}>
                        <h3>Order #{order.OrderID}</h3>

                        <p>
                            <strong>Address:</strong> {order.StreetAddress}
                        </p>

                        <p>
                            <strong>Suburb:</strong> {order.Suburb}
                        </p>

                        <p>
                            <strong>State:</strong> {order.State}
                        </p>

                        <p>
                            <strong>Postcode:</strong> {order.PostCode}
                        </p>
                        <p>
                            <strong>Current status:</strong>{"Processing"}
                        </p>
                        <Button
                            type="primary"
                            onClick={() => {
                                setSelectedOrder(order);

                                form.setFieldsValue({
                                    streetAddress: order.StreetAddress,
                                    suburb: order.Suburb,
                                    state: order.State,
                                    postCode: order.PostCode,
                                });

                                setEditOpen(true);
                            }}
                        >
                            Edit Delivery Address
                        </Button>
                        <ul>
                        {order.Items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    </Card>
                ))
            )}

            <Modal
                title="Edit Delivery Address"
                open={editOpen}
                onCancel={() => setEditOpen(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSaveOrder}
                >
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
            </Modal>

        </section>
        
        
    );

}

export default Orders;