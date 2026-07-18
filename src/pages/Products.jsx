/*Author: Alan 20 June 2026*/
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from "antd";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import api from "../api";

const productImages = import.meta.glob(
  "../assets/{Books,Movies,Games}/*.jpg",
  { eager: true, import: "default" }
);

const getProductImage = (product, category) => {
  const safeName = product.Name.replace(/[<>:"/\\|?*]/g, "");
  const fileName = `${String(product.ID).padStart(3, "0")}-${safeName}.jpg`;

  return (
    productImages[`../assets/${category}/${fileName}`] ||
    "https://placehold.co/300x450?text=No+Image"
  );
};

function Products({ openPage, currentUser }) {
  //product source CRUD
  const [createSourceOpen, setCreateSourceOpen] = useState(false);
  const [editSourceOpen, setEditSourceOpen] = useState(false);
  const [deleteSourceOpen, setDeleteSourceOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [editSourceForm] = Form.useForm();
  
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [games, setGames] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [sources, setSources] = useState([]);

const [form] = Form.useForm();
const [sourceForm] = Form.useForm();
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

    const loadSources = async () => {
        try {
            const response = await api.get("/Source?limit=1000");
            setSources(response.data.list);
        }
        catch (error) {
            console.log(error);
        }
    };

  useEffect(() => {
    loadProducts();
    loadSources();
  }, []);

  const renderSection = (title, items, category) => (
    <>
      <h2 style={{ marginTop: 30 }}>{title}</h2>

      <Row gutter={[16, 16]}>
        {items.map((product) => (
          <Col span={8} key={product.ID}>
            <Card
  hoverable
  cover={
    <div
      style={{
        height: 320,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f8f8",
        padding: 20,
      }}
    >
      <img
        src={getProductImage(product, category)}
        alt={product.Name}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  }
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
    onClick={async (e) => {
        e.stopPropagation();

        // Get all Stocktake records
    const stockResponse = await api.get("/Stocktake?limit=1000");

    // Find the stock record for this product
    const stock = stockResponse.data.list.find(
        (item) => item.ProductId === product.ID
        
    );

    // Save product + stock together
    setEditingProduct({
        ...product,
        stock,
    });

        form.setFieldsValue({
    Name: product.Name,
    Author: product.Author,
    Description: product.Description,
    Published: product.Published?.substring(0, 4),
    Price: stock?.Price,
    Quantity: stock?.Quantity,
    SourceId: stock?.SourceId,
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
    await api.patch(`/Stocktake/${editingProduct.stock.ItemId}`, {
    Price: Number(values.Price),
    Quantity: Number(values.Quantity),
    SourceId: Number(values.SourceId),
});

    message.success("Product updated successfully!");

    setEditOpen(false);

    await loadProducts();

  } catch (error) {

    console.log(error.response?.data);

    message.error("Unable to update product.");

  }
};
const handleDeleteSource = async (source) => {

    Modal.confirm({

        title: "Delete Source",

        content: `Delete ${source.SourceName}?`,

        onOk: async () => {

            try {

                await api.delete(`/Source/${source.Sourceid}`);

                message.success("Source deleted.");

                await loadSources();

            }

            catch (error) {

                console.log(error.response);

                message.error("Unable to delete source.");

            }

        }

    });

};
const handleEditSource = async (values) => {

    try {

        await api.patch(

            `/Source/${editingSource.Sourceid}`,

            {

                SourceName: values.SourceName,

                ExternalLink: values.ExternalLink,

                Genre: editingSource.Genre,

            }

        );

        message.success("Source updated.");

        await loadSources();

        setEditSourceOpen(false);

    }

    catch (error) {

        console.log(error.response);

        message.error("Unable to update source.");

    }

};

return (
  <>
    <section className="planned-page">
      <h1>Products</h1>

      {currentUser?.IsAdmin && (
  <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
    <Button
      type="primary"
      onClick={() => {
        form.resetFields();
        setCreateOpen(true);
      }}
    >
      + Create Product
    </Button>

    <Button
      onClick={() => {
        form.resetFields();
        setCreateSourceOpen(true);
      }}
    >
      + Create Source
    </Button>
    <Button onClick={() => setEditSourceOpen(true)}>
    Edit Source
    </Button>
    <Button danger onClick={() => setDeleteSourceOpen(true)}>
    - Delete Source
    </Button>
  </div>
)}

      {currentUser?.IsAdmin ? (
        renderSection("All Products", allProducts)
      ) : (
        <>
          {renderSection("📚 Books", books, "Books")}
{renderSection("🎬 Movies", movies, "Movies")}
{renderSection("🎮 Games", games, "Games")}
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
      SourceId: Number(values.SourceId),
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
          pattern: /^\d{4}$/,
          message: "Use YYYY format (e.g. 2026).",
        },
      ]}
    >
      <Input placeholder="YYYY" />
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
    <Form.Item
      label="Source"
      name="SourceId"
      rules={[{ required: true }]}
    >
      <Select
    options={sources.map(source => ({
        value: source.Sourceid,
        label: source.SourceName,
    }))}
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
          pattern: /^\d{4}$/,
          message: "Use YYYY format (e.g. 2026).",
        },
      ]}
    >
      <Input placeholder="YYYY" />
    </Form.Item>
    <Form.Item
  label="Price"
  name="Price"
  rules={[{ required: true }]}
>
  <Input
    type="number"
    min={0}
  />
</Form.Item>
<Form.Item
    label="Source"
    name="SourceId"
    rules={[{ required: true }]}
>
    <Select
    options={sources.map(source => ({
        value: source.Sourceid,
        label: source.SourceName,
    }))}
    />
</Form.Item>
<Form.Item
  label="Source ID"
  name="SourceId"
  rules={[{ required: true }]}
>
  <Input disabled/>
</Form.Item>

<Form.Item
  label="Quantity"
  name="Quantity"
  rules={[{ required: true }]}
>
  <Input
    type="number"
    min={0}
  />
</Form.Item>
  </Form>
</Modal>
<Modal
  open={createSourceOpen}
  title="Create Source"
  onCancel={() => {
    sourceForm.resetFields();
    setCreateSourceOpen(false);
  }}
  onOk={() => sourceForm.submit()}
  okText="Create"
>
  <Form
    form={sourceForm}
    layout="vertical"
    onFinish={async (values) => {
      try {

        await api.post("/Source", {
          SourceName: values.Name,
        });

        await loadSources();

        message.success("Source created successfully!");

        sourceForm.resetFields();
        setCreateSourceOpen(false);

      } catch (error) {

        console.log(error.response?.data);

        message.error("Unable to create source.");

      }
    }}
  >

    <Form.Item
      label="Source Name"
      name="Name"
      rules={[
        {
          required: true,
          message: "Please enter a source name.",
        },
      ]}
    >
      <Input placeholder="e.g. Amazon" />
    </Form.Item>

  </Form>
</Modal>
<Modal
    title="Delete Source"
    open={deleteSourceOpen}
    onCancel={() => setDeleteSourceOpen(false)}
    footer={null}
>

    {sources.map(source => (

        <Card
            key={source.Sourceid}
            hoverable
            style={{ marginBottom: 10 }}
            onClick={() => handleDeleteSource(source)}
        >

            <strong>{source.SourceName}</strong>

        </Card>

    ))}

</Modal>
<Modal
    title="Edit Source"
    open={editSourceOpen}
    onCancel={() => setEditSourceOpen(false)}
    footer={null}
>
    {sources.map(source => (

        <Card
            key={source.Sourceid}
            hoverable
            style={{ marginBottom: 10 }}
            onClick={() => {

                setEditingSource(source);

                editSourceForm.setFieldsValue({

                    SourceName: source.SourceName,
                    ExternalLink: source.ExternalLink,
                    Genre: source.Genre,

                });

            }}
        >

            <strong>{source.SourceName}</strong>

        </Card>

    ))}

    <Form
        form={editSourceForm}
        layout="vertical"
        onFinish={handleEditSource}
    >

        <Form.Item
            label="Source Name"
            name="SourceName"
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="External Link"
            name="ExternalLink"
        >
            <Input />
        </Form.Item>

        <Button
            htmlType="submit"
            type="primary"
            block
        >
            Save Changes
        </Button>

    </Form>

</Modal>

</>

);
}


export default Products;