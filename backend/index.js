
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "items.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ items: [], nextId: 1 }, null, 2));
  }
}

function loadData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) parsed.items = [];
    if (typeof parsed.nextId !== "number") parsed.nextId = parsed.items.length ? Math.max(...parsed.items.map(i => i.id)) + 1 : 1;
    return parsed;
  } catch (err) {
    return { items: [], nextId: 1 };
  }
}

function saveData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let store = loadData();
let items = store.items;
let nextId = store.nextId;

function persist() {
  saveData({ items, nextId });
}

app.get("/", (req, res) => {
  res.json({ message: "Lost Link API is running!" });
});

// Get all lost and found items (optional search/filter via query)
app.get("/api/items", (req, res) => {
  const { type, q, search } = req.query;
  let result = [...items];

  if (type && ["Lost", "Found"].includes(type)) {
    result = result.filter((item) => item.type === type);
  }

  const query = (q || search || "").toString().toLowerCase().trim();
  if (query) {
    result = result.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      const location = (item.location || "").toLowerCase();
      const contact = (item.contact || "").toLowerCase();
      return title.includes(query) || description.includes(query) || location.includes(query) || contact.includes(query);
    });
  }

  res.json(result);
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
    title: String(title).trim(),
    description: String(description).trim(),
    location: String(location).trim(),
    date: date || "",
    type,
    contact: String(contact).trim(),
    createdAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  persist();
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
  persist();
  res.json({ message: "Item deleted successfully." });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lost Link backend running on port ${PORT}`);
});
