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

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <h1>Entertainment Guild</h1>
          <p>Online shopping website prototype</p>
        </div>
        <span className="status-label">In progress</span>
      </header>

      <nav className="page-nav" aria-label="Prototype pages">
        {pages.map((page) => (
          <button
            className={activePage === page.id ? 'active' : ''}
            key={page.id}
            onClick={() => setActivePage(page.id)}
            type="button"
          >
            {page.label}
          </button>
        ))}
      </nav>

      <CurrentPage />
    </main>
  );
}

export default App;
