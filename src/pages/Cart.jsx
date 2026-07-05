/*Author: Alan 20 June 2026*/
import { Card, Button, message, Modal, Form, Input, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../api";
import apiAuth from "./apiAuth";

const { Title, Text } = Typography;

function Cart({
  openPage,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  currentUser,
  setCurrentUser,
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  

  const subtotal = cartItems.reduce(
  (total, item) => total + (item.Price ?? 0) * item.quantity,
  0
);

    const handleCheckout = () => {

        if (cartItems.length === 0) {
            message.warning("Your cart is empty.");
            return;
        }

        if (!currentUser) {
            setLoginOpen(true);
            return;
        }

        setCheckoutOpen(true);

    };

    const handleLogin = async (values) => {

    try {

        await apiAuth.post("/login", {
            username: values.username,
            password: values.password,
        });

        const meResponse = await apiAuth.get("/me");
        const usersResponse = await api.get("/User");

        const loggedInUser = usersResponse.data.list.find(
            (user) => user.Email.toLowerCase() === meResponse.data.email.toLowerCase()
        );
        //test line
        console.log(loggedInUser);
        setCurrentUser(loggedInUser);

        message.success("Login successful!");

        setLoginOpen(false);
        setCheckoutOpen(true);

    } catch (error) {

        message.error("Invalid username or password.");

    }

  };


    const handlePayment = async (values) => {

      const paymentSuccess = Math.random() < 0.5;

      if (!paymentSuccess) {
          message.error("Payment failed. Please try again.");
          return;
      }

      message.loading({
          content: "Processing payment...",
          key: "payment",
          duration: 2,
      });

            try {

          const toResponse = await api.get("/TO");
          const patronsResponse = await api.get("/Patrons");
          const patron = patronsResponse.data.list.find((p) => p.Email.toLowerCase() === currentUser.Email.toLowerCase());

          let customer = toResponse.data.list.find(
              (record) => record.PatronId === currentUser.UserID
          );

              if (!customer) {
                //test line  
                console.log("Current user",currentUser);
                  await api.post("/TO", {
                      PatronId: patron.UserID,
                      Email: currentUser.Email,
                      PhoneNumber: values.phoneNumber,
                      StreetAddress: values.streetAddress,
                      PostCode: Number(values.postCode),
                      Suburb: values.suburb,
                      State: values.state,
                      CardNumber: values.cardNumber,
                      CardOwner: values.cardOwner,
                      Expiry: values.expiry,
                      CVV: Number(values.cvv),
                  });

                  const updatedTO = await api.get("/TO");

                  customer = updatedTO.data.list.find(
                      (record) => record.PatronId === patron.UserID
                  );

              }

          await api.post("/Orders", {
              Customer: customer.CustomerID,
              StreetAddress: values.streetAddress,
              PostCode: Number(values.postCode),
              Suburb: values.suburb,
              State: values.state,
          });

          message.success({
              content: "Payment successful! Order placed.",
              key: "payment",
          });

          clearCart();
          setCheckoutOpen(false);

      } catch (error) {
          
          console.log(error);
          console.log(error.response?.data);
          console.log(error.response);

          message.error({
              content: "Order could not be made. Please try again.",
              key: "payment",
          });

      }
    };    

  return (
    <section className="planned-page cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
     {cartItems.length === 0 ? (

  <p>Your cart is empty.</p>

) : (

  cartItems.map((item, index) => (

    <Card
      key={index}
      style={{ marginBottom: 15 }}
    >

      <h3>{item.Name}</h3>

      <p>
      <strong>Author:</strong> {item.Author}
      </p>
      <p>
  <strong>Price:</strong> ${item.Price.toFixed(2)}
</p>

<p>
  <strong>Item Total:</strong> $
  {(item.Price * item.quantity).toFixed(2)}
</p>

<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <Button onClick={() => decreaseQuantity(item.ID)}>-</Button>

  <strong>{item.quantity}</strong>

  <Button onClick={() => increaseQuantity(item.ID)}>+</Button>
  <Button
  danger
  style={{ marginTop: 10 }}
  onClick={() => removeFromCart(item.ID)}
>
  Remove
</Button>
</div>
    </Card>

  ))

)}
      </div>
      <div className="subtotal-row">
        <span />
        <p>
  <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
  </p>
        <Button
  type="primary"
  size="large"
  onClick={handleCheckout}
  >
  Checkout
  </Button>
      </div>

  <Modal
    title="Checkout"
    open={checkoutOpen}
    onCancel={() => setCheckoutOpen(false)}
    footer={null}
>
      <Form layout="vertical"
      onFinish = {handlePayment}>

      <Form.Item
          label="Street Address"
          name="streetAddress"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>

      <Form.Item
          label="Post Code"
          name="postCode"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>

      <Form.Item
          label="Suburb"
          name="suburb"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>

      <Form.Item
          label="State"
          name="state"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>
      <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>

      <Form.Item
          label="Card Number"
          name="cardNumber"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>

      <Form.Item
          label="Card Owner"
          name="cardOwner"
          rules={[{ required: true }]}
      >
          <Input />
      </Form.Item>

      <Form.Item
          label="Expiry (MM/YY)"
          name="expiry"
          rules={[{ required: true }]}
      >
          <Input placeholder="MM/YY" />
      </Form.Item>

      <Form.Item
          label="CVV"
          name="cvv"
          rules={[{ required: true }]}
      >
          <Input.Password />
      </Form.Item>


      <Button
          type="primary"
          htmlType="submit"
          block
      >
          Pay Now
      </Button>

    </Form>
  </Modal>

  <Modal
    title="Login Required"
    open={loginOpen}
    onCancel={() => setLoginOpen(false)}
    footer={null}
>
    <Form
    layout="vertical"
    onFinish={handleLogin}
>
    <Form.Item
        label="Username"
        name="username"
        rules={[
            {
                required: true,
                message: "Please enter your username",
            },
        ]}
    >
        <Input
            prefix={<UserOutlined />}
        />
    </Form.Item>

    <Form.Item
        label="Password"
        name="password"
        rules={[
            {
                required: true,
                message: "Please enter your password",
            },
        ]}
    >
        <Input.Password
            prefix={<LockOutlined />}
        />
    </Form.Item>

        <Button
            type="primary"
            htmlType="submit"
            block
        >
            Login
        </Button>
      <div style={{
              marginTop: 16,
              textAlign: "center",
            }}>
          Don't have an account?{" "}
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
                setLoginOpen(false);
                openPage("signup");
              }}>
              Sign up here
          </Button>
      </div>
    </Form>
  </Modal>

    </section>
  );
}

export default Cart;
