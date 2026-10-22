
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let items = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.json({ message: "Lost Link API is running!" });
});

// Get all lost and found items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// Add a lost or found item
app.post("/api/items", (req, res) => {
  const { title, description, location, date, type, contact } = req.body;

  if (!title || !description || !location || !type || !contact) {
    return res.status(400).json({
      message: "Please fill in all required fields.",
    });
  }

  if (!["Lost", "Found"].includes(type)) {
    return res.status(400).json({
      message: "Type must be Lost or Found.",
    });
  }

  const newItem = {
    id: nextId++,
    title,
    description,
    location,
    date: date || "",
    type,
    contact,
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// Delete an item
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found." });
  }

  items.splice(index, 1);
  res.json({ message: "Item deleted successfully." });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lost Link backend running on port ${PORT}`);
});
