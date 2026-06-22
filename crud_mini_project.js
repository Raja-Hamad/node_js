const express = require("express");
const app = express();

app.use(express.json());

let products = [
  { id: 1, name: "Shoes", price: 1500 },
  { id: 2, name: "Watch", price: 5000 }
];

app.get("/products", (req, res) => {
  res.json(products);
});


// GET: Single product

app.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

//POST: Create single product

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    price
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Product created",
    product: newProduct
  });
});

//PUT: Update product

app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.name = name || product.name;
  product.price = price || product.price;

  res.json({
    message: "Product updated",
    product
  });
});

//DELETE: Delete product

app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  const newProducts = products.filter(p => p.id !== id);

  products = newProducts;

  res.json({
    message: "Product deleted"
  });
});

app.listen(3000, () => {
  console.log("Server running on 3000");
});