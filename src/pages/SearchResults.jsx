/*Author: Alan 20 June 2026*/

import { useEffect, useState } from "react";
import { Card, Button, Empty, Typography } from "antd";
import api from "../api";

const { Paragraph } = Typography;

function SearchResults({ searchText, openPage }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/Product?limit=1000")
      .then((response) => {
        setProducts(response.data.list);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredProducts = products.filter((product) => {

    const search = (searchText || "").toLowerCase();

    return (
      product.Name?.toLowerCase().includes(search) ||
      product.Author?.toLowerCase().includes(search) ||
      product.Description?.toLowerCase().includes(search)
    );

  });

  return (
    <div>

      <h2>Search Results</h2>

      <p>
        Searching for:
        <strong> {searchText}</strong>
      </p>

      <p>
        {filteredProducts.length} product(s) found
      </p>

      {filteredProducts.length === 0 ? (

        <Empty description="No products found" />

      ) : (

        filteredProducts.map((product) => (

          <Card
            key={product.ID}
            hoverable
            style={{ marginBottom: 20 }}
            onClick={() => openPage("product", product)}
          >

            <h2>{product.Name}</h2>

            <p>
              <strong>Author:</strong> {product.Author}
            </p>

            <p>
              <strong>Published:</strong>{" "}
              {new Date(product.Published).getFullYear()}
            </p>

            <Paragraph ellipsis={{ rows: 3 }}>
              {product.Description}
            </Paragraph>

            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                openPage("product", product);
              }}
            >
              View Details
            </Button>

          </Card>

        ))

      )}

    </div>
  );
}

export default SearchResults;