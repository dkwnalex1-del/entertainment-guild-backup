/*Author: Alan 20 June 2026*/
function ProductDetails({ openPage }) {
  return (
    <section className="planned-page product-page">
      <h2>Product Page</h2>
      <div className="product-panel">
        <p>Description, price</p>
        <strong>Entertainment Guild featured item</strong>
      </div>
      <div className="product-actions">
        <button onClick={() => openPage('cart')} type="button">
          Add to cart
        </button>
        <button onClick={() => openPage('cart')} type="button">
          Buy now
        </button>
      </div>
    </section>
  );
}

export default ProductDetails;
