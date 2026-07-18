/*Author: Alan 20 June 2026*/
import { Card, Button, Image } from 'antd';
import { useEffect, useState } from 'react';
import api from '../api';
import allKingsMen from "../assets/Books/allthekingsmen.jpeg";
const bookImages = {
  "All the King's Men": allKingsMen,
};

function ProductDetails({ openPage, selectedProduct, addToCart}) {
  const [stockInfo, setStockInfo] = useState(null);
  console.log(selectedProduct);
  useEffect(() => {
  if (!selectedProduct) return;

  api.get("/Stocktake?limit=1000")
    .then((response) => {

      const item = response.data.list.find(
        (stock) => stock.ProductId === selectedProduct.ID
      );

      setStockInfo(item);

      console.log("Stock Info:", item);

    })
    .catch((error) => {
      console.log(error);
    });

}, [selectedProduct]);
  return (
    <section className="planned-page product-page">
      <h2>{selectedProduct?.Name}</h2>

      <Card className="product-panel">

  <div className="product-layout">

    <Image
  width={250}
  preview={false}
  src={
    bookImages[selectedProduct?.Name] ||
    "https://placehold.co/250x350?text=Book+Cover"
  }
/>

    <div className="product-info">

      <h2>{selectedProduct?.Name}</h2>

      <p>
        <strong>Author:</strong> {selectedProduct?.Author}
      </p>
      <p>
  <strong>Price:</strong>{" "}
  {stockInfo ? `$${stockInfo.Price.toFixed(2)}` : "Loading..."}
</p>

<p>
  <strong>Stock:</strong>{" "}
  {stockInfo
    ? stockInfo.Quantity > 0
      ? `${stockInfo.Quantity} available`
      : "❌ Out of Stock"
    : "Loading..."}
</p>

      <p>
        <strong>Published:</strong>{" "}
        {new Date(selectedProduct?.Published).getFullYear()}
      </p>

      <h3>Description</h3>

      <p>{selectedProduct?.Description}</p>

     <Button
  type="primary"
  size="large"
  disabled={stockInfo?.Quantity === 0}
  onClick={() => {
    addToCart({
      ...selectedProduct,
      Price: stockInfo?.Price ?? 0,
      Stock: stockInfo?.Quantity ?? 0,
    });

    openPage("cart");
  }}
>
  {stockInfo?.Quantity === 0 ? "Out of Stock" : "Add to Cart"}
</Button>

      <Button
  type="primary"
  size="large"
  style={{ marginLeft: 10 }}
  disabled={stockInfo?.Quantity === 0}
  onClick={() => openPage("cart")}
>
  Buy Now
</Button>

    </div>

  </div>

</Card>
          
    </section>
  );
}

export default ProductDetails;
