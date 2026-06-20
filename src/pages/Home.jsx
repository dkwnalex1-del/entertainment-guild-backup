function Home({ openPage }) {
  return (
    <section className="home-grid" aria-label="Homepage wireframe">
      <button className="feature-card hero-product" onClick={() => openPage('product')} type="button">
        <span>Featured Product</span>
        <strong>Console Game Bundle</strong>
        <small>Click to view product page</small>
      </button>

      <div className="side-products">
        <button className="feature-card" onClick={() => openPage('product')} type="button">
          <span>Featured Product</span>
          <strong>Movie Night Pack</strong>
        </button>
        <button className="feature-card" onClick={() => openPage('product')} type="button">
          <span>Featured Product</span>
          <strong>Gaming Headset</strong>
        </button>
      </div>
    </section>
  );
}

export default Home;
