import { useState, useEffect } from "react";

import CustomerCard from "./components/CustomerCard";
import SearchBar from "./components/SearchBar";
import CustomerDetail from "./components/CustomerDetail";
import Spinner from "./components/Spinner";

import "./App.css";

export const API_BASE = "http://localhost:3001";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  tags: [],
  status: "active",
};

const ALL_TAGS = ["VIP", "Lead", "Referral"];

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Derived state
  const filteredCustomers = customers.filter(
    (c) =>
      (statusFilter === "all" || c.status === statusFilter) &&
      (c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        // Simulate network delay to show the loading spinner
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await fetch(`${API_BASE}/customers`);
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    // [e.target.name] evaluates to the value e.g. firstName: "a"
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.status}`);
      }

      setCustomers(customers.filter((c) => c.id !== customerId));

      if (selectedId === customerId) {
        setSelectedId(null);
      }
    } catch (err) {
      alert(err.message);
    }

    // setCustomers(customers.filter((c) => c.id !== customerId));
    // if (selectedCustomer?.id === customerId) {
    //   setSelectedCustomer(null);
    // }
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      // Set tags based on whether the tag is already included in the form's tags array
      // prev.tags.includes(tag) means the tag is already selected
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddCustomer = async (e) => {
    // Prevent the page from reloading
    e.preventDefault();
    setSubmitting(true);

    // Create the new customer object to be added
    const newCustomer = {
      // id: generateCustomerId(),
      // firstName: firstName
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: "",
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(`Failed to add customer: ${response.status}`);
      }

      const created = await response.json();
      // Update the state customers with the new customer
      setCustomers([...customers, created]);
      // setCustomers([...customers, newCustomer]);
      // Clear the form
      setForm(INITIAL_FORM);
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (customerId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.status}`);
      }

      const updated = await response.json();
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? updated : c)),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="simple-crm">
      <h1>Simple CRM</h1>

      <button
        className="toggle-form-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Customer"}
      </button>

      {showForm && (
        <form onSubmit={handleAddCustomer} className="add-customer-form">
          <h3>Add New Customer</h3>
          <div className="form-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g. Sarah"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Chen"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. sarah.chen@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Tags</label>
            <div className="tag-options">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          <div className="filter-bar">
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                className={`filter-btn${statusFilter === f ? " filter-btn-active" : ""}`}
                onClick={() => setStatusFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="customer-list">
            <h2>Customers ({filteredCustomers.length})</h2>

            {filteredCustomers.length === 0 ? (
              <p className="empty-state">
                {searchTerm
                  ? "No customers match your search."
                  : "No customers yet. Add one above!"}
              </p>
            ) : (
              <div className="customers">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onDelete={handleDeleteCustomer}
                    onSelect={setSelectedId}
                    isSelected={selectedId === customer.id}
                    // onSelect={setSelectedCustomer}
                    // isSelected={selectedCustomer?.id === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <CustomerDetail
          selectedId={selectedId}
          onUpdate={handleUpdateCustomer}
        />
      </div>
    </div>
  );
}

export default App;
