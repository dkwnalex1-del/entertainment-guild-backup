/*Author: Alan 20 June 2026*/
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from "antd";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import api from "../api";

function Products({ openPage, currentUser }) {
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [games, setGames] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

const [form] = Form.useForm();
 const loadProducts = async () => {
  try {
    const [productResponse, genreResponse] = await Promise.all([
      api.get("/Product?limit=1000"),
      api.get("/Genre?limit=1000"),
    ]);

    const allProducts = productResponse.data.list;
    const genres = genreResponse.data.list;

    setAllProducts(allProducts);

    const getProductsFromGenre = (genreName) => {
      const genre = genres.find((g) => g.Name === genreName);

      if (!genre || !genre["Product List"]) return [];

      return genre["Product List"]
        .map((item) =>
          allProducts.find((product) => product.ID === item.ID)
        )
        .filter(Boolean);
    };

    setBooks(getProductsFromGenre("Books"));
    setMovies(getProductsFromGenre("Movies"));
    setGames(getProductsFromGenre("Games"));

  } catch (error) {
    console.log(error);
  }
}; 
useEffect(() => {
  loadProducts();
}, []);
  const renderSection = (title, items) => (
    <>
      <h2 style={{ marginTop: 30 }}>{title}</h2>

      <Row gutter={[16, 16]}>
        {items.map((product) => (
          <Col span={8} key={product.ID}>
            <Card
              hoverable
              onClick={() => openPage("product", product)}
            >
              <h3>{product.Name}</h3>

              <p>
                <strong>Author:</strong>{" "}
                {product.Author || "N/A"}
              </p>

              <Button
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  openPage("product", product);
                }}
              >
                View Details
              </Button>
              {currentUser?.IsAdmin && (
  <>
    <Button
    onClick={(e) => {
        e.stopPropagation();

        setEditingProduct(product);

        form.setFieldsValue({
            Name: product.Name,
            Author: product.Author,
            Description: product.Description,
        });

        setEditOpen(true);
    }}
>
    Edit
</Button>

    <Button
    danger
    onClick={(e) => {
        e.stopPropagation();

       Modal.confirm({
  title: "Delete Product",
  content: `Delete ${product.Name}?`,
  onOk: async () => {
    try {

      // Find all Stocktake records for this product
      const stockResponse = await api.get("/Stocktake?limit=1000");

      const stockItems = stockResponse.data.list.filter(
        (item) => item.ProductId === product.ID
      );

      // Delete all matching Stocktake records
      for (const stock of stockItems) {
        await api.delete(`/Stocktake/${stock.ItemId}`);
      }

      // Now delete the Product
      await api.delete(`/Product/${product.ID}`);

      message.success("Product deleted successfully.");

      await loadProducts();

    } catch (error) {

      console.log(error.response?.data);

      message.error("Unable to delete product.");
                }
              }
        });
    }}
>
    Delete
</Button>
  </>
)}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

const handleEditProduct = async (values) => {
  try {

    await api.patch(`/Product/${editingProduct.ID}`, {
      Name: values.Name,
      Author: values.Author,
      Description: values.Description,
      Published: values.Published
    });

    message.success("Product updated successfully!");

    setEditOpen(false);

    await loadProducts();

  } catch (error) {

    console.log(error.response?.data);

    message.error("Unable to update product.");

  }
};

return (
  <>
    <section className="planned-page">
      <h1>Products</h1>

      {currentUser?.IsAdmin && (
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setCreateOpen(true);
          }}
        >
          + Create Product
        </Button>
      )}

      {currentUser?.IsAdmin ? (
        renderSection("All Products", allProducts)
      ) : (
        <>
          {renderSection("📚 Books", books)}
          {renderSection("🎬 Movies", movies)}
          {renderSection("🎮 Games", games)}
        </>
      )}
    </section>

    <Modal
      open={createOpen}
      title="Create Product"
      onCancel={() => setCreateOpen(false)}
      onOk={() => form.submit()}
      okText="Create"
>
  <Form
    form={form}
    layout="vertical"
      onFinish={async (values) => {
  try {
    const productResponse = await api.post("/Product", {
      Name: values.Name,
      Author: values.Author,
      Description: values.Description,
      Genre: 1,
      SubGenre: 1,
      Published: values.Published,
      LastUpdatedBy: currentUser.UserName,
    });

    console.log(productResponse.data);

    // Get the new Product ID
    const productID = productResponse.data.ID;

    // Create the Stocktake record
    await api.post("/Stocktake", {
      ProductId: productID,
      SourceId: 1,
      Price: Number(values.Price),
      Quantity: Number(values.Quantity),
    });

    message.success("Product created successfully!");

    setCreateOpen(false);
    form.resetFields();

    await loadProducts();

  } catch (error) {
    console.log(error.response?.data);
    message.error("Unable to create product.");
  }
}}
  >
    <Form.Item
      label="Product Name"
      name="Name"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Author"
      name="Author"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Description"
      name="Description"
    >
      <Input.TextArea rows={4} />
    </Form.Item>

    <Form.Item
      label="Published"
      name="Published"
      rules={[
        { required: true, message: "Please enter a publication date." },
        {
          pattern: /^\d{4}-\d{2}-\d{2}$/,
          message: "Use YYYY-MM-DD format (e.g. 2026-07-05).",
        },
      ]}
    >
      <Input placeholder="YYYY-MM-DD" />
    </Form.Item>
        <Form.Item
      label="Price"
      name="Price"
      rules={[{ required: true }]}
    >
      <Input
        type="number"
        placeholder="0.00"
      />
      </Form.Item>
      <Form.Item
        label="Quantity"
        name="Quantity"
        rules={[{ required: true }]}
      >
        <Input
          type="number"
          placeholder="0"
        />
    </Form.Item>
  </Form>
</Modal>

<Modal
  open={editOpen}
  title="Edit Product"
  onCancel={() => setEditOpen(false)}
  onOk={() => form.submit()}
  okText="Save Changes"
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleEditProduct}
  >
    <Form.Item
      label="Product Name"
      name="Name"
      rules={[{ required: true }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Author"
      name="Author"
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Description"
      name="Description"
    >
      <Input.TextArea rows={4} />
    </Form.Item>

    <Form.Item
      label="Published"
      name="Published"
      rules={[
        { required: true, message: "Please enter a publication date." },
        {
          pattern: /^\d{4}-\d{2}-\d{2}$/,
          message: "Use YYYY-MM-DD format (e.g. 2026-07-05).",
        },
      ]}
    >
      <Input placeholder="YYYY-MM-DD" />
    </Form.Item>
  </Form>
</Modal>
  </>
);
}

export default Products;