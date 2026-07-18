/*Author: Alan 20 June 2026*/
import augieMarch from "../assets/Books/AugieMarch.jpg";
import aguirreTheWrathOfGod from "../assets/Movies/AguirreTheWrathofGod.jpg";
import starWarsKOTOR from "../assets/Games/StarWarsKnightsofTheOldRepublic.jpg";
import hero from "../assets/hero.png";
import { Card, Button, Row, Col, message, Image } from "antd";
import { useEffect, useState } from "react";
import api from "../api";

const categories = [
  "Games",
  "Movies",
  "Books",
  "Figures",
  "Merchandise",
  "Accessories",
 
];
 const productImages = {
  "The Adventures of Augie March": augieMarch,
  "Aguirre: The Wrath of God": aguirreTheWrathOfGod,
  "Star Wars: Knights of the Old Republic": starWarsKOTOR,
};
const getProductImage = (product, category) => {
  const safeName = product.Name.replace(/[<>:"/\\|?*]/g, "");
  const fileName = `${String(product.ID).padStart(3, "0")}-${safeName}.jpg`;

  return (
    productImages[`../assets/${category}/${fileName}`] ||
    "https://placehold.co/300x450?text=No+Image"
  );
};

function Home({ openPage, currentUser, addToCart }) {
const [featuredBook, setFeaturedBook] = useState(null);
const [featuredMovie, setFeaturedMovie] = useState(null);
const [featuredGame, setFeaturedGame] = useState(null);
const [stockList, setStockList] = useState([]);

useEffect(() => {
  Promise.all([
    api.get("/Product?limit=1000"),
    api.get("/Genre?limit=1000"),
    api.get("/Stocktake?limit=1000")
  ])
    .then(([productResponse, genreResponse, stockResponse]) => {

      const allProducts = productResponse.data.list;
      const genres = genreResponse.data.list;
      const stock = stockResponse.data.list;
      setStockList(stock);

      const getFeatured = (genreName) => {
        const genre = genres.find(g => g.Name === genreName);
      

        if (!genre) return null;

        const first = genre["Product List"][0];

        return allProducts.find(
          p => p.ID === first.ID
        );
      };

      setFeaturedBook(getFeatured("Books"));
      setFeaturedMovie(getFeatured("Movies"));
      setFeaturedGame(getFeatured("Games"));

    })
    .catch(console.error);

}, []);

      const getStockInfo = (productID) => {
        return stockList.find(item => item.ProductId === productID);
      };

  return (
    
    <>
    <div className="welcome-banner">
  <h4>
    Welcome, {currentUser ? currentUser.UserName : "Guest"} 👋
  </h4>
</div>
    <section className="home-grid" aria-label="Homepage wireframe">
       <Card
  className="hero-banner"
  hoverable
  onClick={() => openPage("product", featuredGame)}
  bodyStyle={{ padding: 40 }}
>
<div className="hero-content">

  <div className="hero-text">

    

    <h1>{featuredGame?.Name}</h1>

    <p>
      Discover your next favourite book, movie and game
      at Entertainment Guild.
    </p>

    <Button
      type="primary"
      size="large"
      disabled={getStockInfo(featuredGame?.ID)?.Quantity === 0}
      onClick={(e) => {
        e.stopPropagation();

        const stock = getStockInfo(featuredGame.ID);

        addToCart({
          ...featuredGame,
          Price: stock?.Price ?? 0,
          Stock: stock?.Quantity ?? 0,
        });

        message.success(`${featuredGame?.Name} added to cart!`);
      }}
    >
      Shop Now
    </Button>

  </div>

  <Image
    preview={false}
    src={
      productImages[featuredGame?.Name] ||
      "https://placehold.co/280x400"
    }
    className="hero-cover"
  />

</div>

</Card>

      <div className="side-products">
        <Card
  className="hero-product"
  hoverable
  onClick={() => openPage("product", featuredMovie)}
>
          <Image
  preview={false}
  height={180}
  style={{ objectFit: "cover" }}
  src={aguirreTheWrathOfGod}
/>
          <p>🎬 Featured Movie</p>
          <h3>{featuredMovie?.Name}</h3>
          <small>Click to view product page</small>
          
          <br />
          <br />

        <Button
          type="primary"
          disabled={getStockInfo(featuredMovie?.ID)?.Quantity === 0}
          onClick={(e) => {
            e.stopPropagation();

            const stock = getStockInfo(featuredMovie.ID);

            addToCart({
              ...featuredMovie,
              Price: stock?.Price ?? 0,
              Stock: stock?.Quantity ?? 0,
            });

            message.success(`${featuredMovie?.Name} added to cart!`);
          }}
        >
          {getStockInfo(featuredMovie?.ID)?.Quantity === 0
            ? "Out of Stock"
            : "Add to Cart"}
        </Button>
 
          </Card>

        <Card
  className="hero-product"
  hoverable
  onClick={() => openPage("product", featuredBook)}
>
          <Image
  preview={false}
  height={180}
  style={{ objectFit: "cover" }}
  src={
    productImages[featuredBook?.Name] ||
    "https://placehold.co/200x300?text=Game"
  }
/>
          <p>🎮 Featured Game</p>
          <h3>{featuredBook?.Name}</h3>
          <small>Click to view product page</small>

          <br />
          <br />
      <Button
        type="primary"
        disabled={getStockInfo(featuredBook?.ID)?.Quantity === 0}
        onClick={(e) => {
          e.stopPropagation();

          const stock = getStockInfo(featuredBook.ID);

          addToCart({
            ...featuredBook,
            Price: stock?.Price ?? 0,
            Stock: stock?.Quantity ?? 0,
          });

          message.success(`${featuredBook?.Name} added to cart!`);
        }}
      >
        {getStockInfo(featuredBook?.ID)?.Quantity === 0
          ? "Out of Stock"
          : "Add to Cart"}
      </Button>
        </Card>
      </div>
    </section>
  </>
  );
}

export default Home;
