import { useState } from 'react';
import './App.css';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';

const pages = [
  { id: 'home', label: 'Home', component: Home },
  { id: 'search', label: 'Search Results', component: SearchResults },
  { id: 'product', label: 'Product Details', component: ProductDetails },
  { id: 'cart', label: 'Shopping Cart', component: Cart },
  { id: 'account', label: 'Manage Account', component: Account },
];

function App() {
  const [activePage, setActivePage] = useState('home');
  const CurrentPage = pages.find((page) => page.id === activePage).component;
  const isHome = activePage === 'home';
  const openPage = (pageId) => setActivePage(pageId);

  return (
    <main className="app-shell">
      <section className="wireframe-screen">
        <header className="top-bar">
          {isHome ? (
            <button className="brand-mark" onClick={() => openPage('home')} type="button">
              <span>EG</span>
            </button>
          ) : (
            <button className="back-link" onClick={() => openPage('home')} type="button">
              &lt; Back to Home page
            </button>
          )}

          <div className="search-tools" aria-label="Search and cart shortcuts">
            <label className="search-box">
              <span className="sr-only">Search products</span>
              <input type="search" aria-label="Search products" />
              <button onClick={() => openPage('search')} type="button">
                Search
              </button>
            </label>
            <button className="cart-shortcut" onClick={() => openPage('cart')} type="button" aria-label="Open cart">
              Cart
            </button>
          </div>
        </header>

        {isHome && (
          <nav className="home-nav" aria-label="Prototype pages">
            <button onClick={() => openPage('home')} type="button">
              Home
            </button>
            <button onClick={() => openPage('search')} type="button">
              Category
            </button>
            <button onClick={() => openPage('account')} type="button">
              Account
            </button>
          </nav>
        )}

        <div className={isHome ? 'page-body home-layout' : 'page-body'}>
          <CurrentPage openPage={openPage} />
        </div>
      </section>
    </main>
  );
}

export default App;
