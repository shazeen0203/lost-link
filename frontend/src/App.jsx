
import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    type: "Lost",
    contact: "",
  });

  async function loadItems() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/api/items`);
      if (!response.ok) throw new Error("Could not load items.");
      setItems(await response.json());
    } catch {
      setError("Cannot connect to the server. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add item.");
      }

      setItems((previous) => [data, ...previous]);
      setForm({
        title: "",
        description: "",
        location: "",
        date: "",
        type: "Lost",
        contact: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  async function deleteItem(id) {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete item.");

      setItems((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleItems =
    filter === "All" ? items : items.filter((item) => item.type === filter);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">L</span> Lost Link
        </a>
        <nav>
          <a href="#home">Home</a>
          <a href="#reports">Reports</a>
          <a href="#report-form" className="nav-button">
            Report an Item
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">LOST SOMETHING? FOUND SOMETHING?</p>
          <h1>
            Lost it? Let's
            <br />
            <span>find the link.</span>
          </h1>
          <p className="hero-description">
            A simple place to report lost belongings and help people
            reconnect with the things that matter.
          </p>
          <a className="primary-button" href="#report-form">
            Report an Item →
          </a>
          <a className="secondary-link" href="#reports">
            Browse reports ↓
          </a>
        </section>

        <section className="content-section" id="report-form">
          <div className="section-heading">
            <p className="eyebrow">HELP MAKE THE CONNECTION</p>
            <h2>Report an item</h2>
            <p>Share a few details so the right person can find it.</p>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>
            <label>
              Report type
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="Lost">I lost something</option>
                <option value="Found">I found something</option>
              </select>
            </label>

            <label>
              Item name *
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Black wallet"
                required
              />
            </label>

            <label>
              Description *
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the item..."
                required
                rows="3"
              />
            </label>

            <div className="form-row">
              <label>
                Location *
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Where was it lost or found?"
                  required
                />
              </label>

              <label>
                Date
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Contact information *
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Email or phone"
                required
              />
            </label>

            <button className="primary-button submit-button" type="submit">
              Publish Report →
            </button>
          </form>
        </section>

        <section className="content-section reports-section" id="reports">
          <div className="section-heading">
            <p className="eyebrow">THE COMMUNITY BOARD</p>
            <h2>Recent reports</h2>
            <p>Browse items reported lost or found.</p>
          </div>

          <div className="filters">
            {["All", "Lost", "Found"].map((option) => (
              <button
                key={option}
                className={filter === option ? "filter active" : "filter"}
                onClick={() => setFilter(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}
          {loading && <p>Loading reports...</p>}

          {!loading && visibleItems.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">⌕</span>
              <h3>No reports yet</h3>
              <p>Be the first to help reunite someone with their belongings.</p>
            </div>
          )}

          <div className="item-grid">
            {visibleItems.map((item) => (
              <article className="item-card" key={item.id}>
                <span
                  className={
                    item.type === "Lost" ? "status lost" : "status found"
                  }
                >
                  {item.type}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="item-details">
                  <span>⌖ {item.location}</span>
                  {item.date && <span>▦ {item.date}</span>}
                </div>
                <p className="contact">Contact: {item.contact}</p>
                <button
                  className="delete-button"
                  onClick={() => deleteItem(item.id)}
                  type="button"
                >
                  Delete report
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">Lost Link</a>
        <p>Every lost item deserves a chance to find its way home.</p>
        <small>© {new Date().getFullYear()} Lost Link</small>
      </footer>
    </div>
  );
}

export default App;
