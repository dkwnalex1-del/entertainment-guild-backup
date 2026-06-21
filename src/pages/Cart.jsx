function Cart() {
  return (
    <section className="planned-page cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        <article>Item 1&nbsp;&nbsp;$X</article>
        <article>Item 2&nbsp;&nbsp;$Y</article>
      </div>
      <div className="subtotal-row">
        <span />
        <p>Subtotal: $X.Y</p>
      </div>
    </section>
  );
}

export default Cart;
