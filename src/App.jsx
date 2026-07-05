/* Done by: Alex , created on 20 June 2026*/

import { Layout, Menu, Input, Button, Badge } from "antd";
import { useState } from "react";
import "./App.css";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import hero from "./assets/hero.png";
import Products from "./pages/Products";
import SignUp from "./pages/Signup";
import apiAuth from "./pages/apiAuth";
import Orders from "./pages/Orders";
import Users from "./pages/Users";

const pages = [
  { id: "login", label: "Login", component: Login },
  { id: "home", label: "Home", component: Home },
  { id: "search", label: "Search Results", component: SearchResults },
  { id: "product", label: "Product Details", component: ProductDetails },
  { id: "cart", label: "Shopping Cart", component: Cart },
  { id: "account", label: "Manage Account", component: Account },
  { id: "products", label: "Products", component: Products },
  { id: "signup", label: "Sign Up", component: SignUp },
  { id: "orders", label: "My Orders", component: Orders },
  {id: "users", label: "Edit Users", component: Users},
];

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState("signup");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  console.log("Active page", activePage);
  const CurrentPage = pages.find(
    (page) => page.id === activePage
  ).component;

  const isHome = activePage === "home";

  const openPage = (pageId, product = null) => {
    setActivePage(pageId);

    if (product) {
      setSelectedProduct(product);
    }
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.ID === product.ID);

      if (existing) {
        return prev.map((item) =>
          item.ID === product.ID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productID) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.ID === productID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productID) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.ID === productID
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productID) => {
    setCartItems((prev) =>
      prev.filter((item) => item.ID !== productID)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const logout = async () => {
    try {
      await apiAuth.post("/logout");

      setCurrentUser(null);
      setCartItems([]);

      openPage("login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="app-shell">
      <section className="wireframe-screen">
        <header className="top-bar">
          {isHome ? (
            <img
              src={hero}
              alt="Entertainment Guild"
              className="brand-logo"
              onClick={() => openPage("home")}
            />
          ) : (
            <button
              className="back-link"
              onClick={() => openPage("home")}
              type="button"
            >
              &lt; Back to Home page
            </button>
          )}

          <div className="search-tools" aria-label="Search and cart shortcuts">
            <Input.Search
              placeholder="Search products"
              onSearch={(value) => {
                setSearchText(value);
                openPage("search");
              }}
              style={{ width: 220 }}
            />

            <Button onClick={() => openPage("cart")}>
              Cart
            </Button>
          </div>
        </header>

        <div className="home-menu">
          <Menu
            mode="horizontal"
            selectedKeys={[activePage]}
            onClick={({ key }) => {
              if (key === "logout") {
                logout();
              } else {
                openPage(key);
              }
            }}
            items={[
              {
                key: "home",
                label: "Home",
              },
              {
                key: "products",
                label: "Products",
              },

              ...(!currentUser
                ? [
                    {
                      key: "login",
                      label: "Login",
                    },
                    {
                      key: "signup",
                      label: "Sign Up",
                    },
                  ]
                : currentUser.IsAdmin
                ? [
                    {
                      key: "users",
                      label: "Users",
                    },
                    {
                      key: "logout",
                      label: "Logout",
                    },
                  ]
                : [
                    {
                      key: "orders",
                      label: "My Orders",
                    },
                    {
                      key: "account",
                      label: "Account",
                    },
                    {
                      key: "logout",
                      label: "Logout",
                    },
                  ]),
            ]}
          />
        </div>

        <div className={isHome ? "page-body home-layout" : "page-body"}>
          <CurrentPage
            openPage={openPage}
            searchText={searchText}
            selectedProduct={selectedProduct}
            cartItems={cartItems}
            addToCart={addToCart}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </div>
      </section>
    </main>
  );
}

export default App;