# Lesson 2.6: Advanced State Management with Context API and Reducers

## Overview

- **Duration:** ~2 hours (hands-on lab)
- **Prerequisites:** Lesson 2.5 (Lists, Asynchronous Programming, and Side Effects)

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Use** the Context API to share state across components without prop drilling
2. **Use** `useReducer` to centralise complex state and the logic that updates it
3. **Combine** Context and `useReducer` to eliminate prop drilling for shared actions

## Introduction

Open `src/App.jsx` from your Lesson 2.5 project and scroll through it. Count the `useState` calls. Trace where `handleDeleteCustomer` is defined, and then trace where it is actually used. Notice how many components receive it as a prop even though only the deepest one calls it.

This lesson introduces two tools that solve two distinct problems:

- **`useReducer`** consolidates scattered `useState` calls and the logic that updates them into one place
- **Context API** makes values available to any component in the tree without passing them through props

You will use each tool on its own first, then combine them.

---

## Part 1: See the Problem (5 minutes)

Before writing any code, take five minutes to read `App.jsx` together with your instructor.

Find the following in the file:

1. How many `useState` calls are there? List the state variables.
2. Where is `handleDeleteCustomer` defined? Where does it actually get called?
3. Where is `handleUpdateCustomer` defined? How many components does it pass through before it is used?
4. What would happen if you needed to add a `user` variable? How many components would need to receive it as a prop?

This exercise establishes the two problems you are about to solve:

- **Problem 1 (messy state):** Many related `useState` calls scattered across `App.jsx`, with logic that can easily get out of sync.
- **Problem 2 (prop drilling):** Callbacks defined at the top of the tree passed through intermediate components that do not use them.

---

## Part 2: Context API, Solving Prop Drilling for Auth (40 minutes)

We will start with Context, using the simplest possible example: adding a logged-in user to the app. This is a value that many components need (the header, individual customer cards, any admin-only UI), but we do not want to pass it as a prop everywhere.

### What is the Context API?

Context is React's built-in mechanism for making a value available to any component in the tree without threading it through props. You create a context object, wrap part of your component tree in a Provider, and any descendant can read the value with `useContext`.

Three steps every time:

```
1. createContext()    → create the context object
2. <Context.Provider> → supply the value at the top of the tree
3. useContext()       → read the value anywhere below
```

### Step 1: Add Users Data

The app currently has no concept of users. Create a new file `src/data/users.js` with two mock accounts, an admin and a regular user:

```js
// src/data/users.js
export const USERS = [
  {
    id: "u1",
    name: "Daniel Goh",
    email: "daniel@simplesystems.io",
    password: "password123",
    role: "admin",
  },
  {
    id: "u2",
    name: "Alice Tan",
    email: "alice@simplesystems.io",
    password: "password123",
    role: "user",
  },
];
```

We are keeping authentication simple on purpose. In a real application, passwords would never be stored in client-side code; the login form would send credentials to a backend, which would verify them and return a token. For this lesson, a hardcoded list lets us focus on the React patterns without the complexity of a real auth system. The context pattern, calling `login(userData)` on success, is identical either way.

### Step 2: Create AuthContext

Create a new folder `src/contexts/` and inside it create `AuthContext.jsx`. We will start with the simplest possible version using only `useState`:

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
```

A few things to notice:

- `AuthContext` is exported so any component can import it and pass it to `useContext` to read the current value.
- The provider wraps `children` and passes the value object down. Any component rendered inside `<AuthProvider>` can call `useContext(AuthContext)` to read it.
- `hasRole` uses optional chaining (`user?.role`) so it is safe to call even when `user` is `null`.

### Step 3: Create the Login Component

Download [`assets/LoginPage.module.css`](assets/LoginPage.module.css) from the lesson materials and copy it to `src/components/LoginPage.module.css`. Take a moment to scan the class names; you will see them used in the JSX below.

Now create **`src/components/LoginPage.jsx`**:

```jsx
// src/components/LoginPage.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { USERS } from "../data/users";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    // In a real app, this would be a POST request to an API endpoint.
    // The backend would verify the credentials and return the user object.
    const match = USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (match) {
      const userData = { ...match };
      delete userData.password;
      login(userData);
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <h1 className={styles.heading}>Sign in</h1>
        <p className={styles.lead}>Welcome back to Simple CRM.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@simplesystems.io"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Sign in
          </button>
        </form>

        <p className={styles.hint}>
          Try: daniel@simplesystems.io / password123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
```

Notice that the password is removed from the copied user object before calling `login()`. Spreading into a new object first ensures we do not mutate the original `USERS` entry. You never want a plain-text password sitting in React state.

### Step 4: Create the Header Component

Download [`assets/Header.module.css`](assets/Header.module.css) from the lesson materials and copy it to `src/components/Header.module.css`. Scan the class names before moving on.

Now create **`src/components/Header.jsx`**:

```jsx
// src/components/Header.jsx
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Simple CRM</h1>
      <div className={styles.userArea}>
        <span className={styles.userName}>{user.name}</span>
        <button className={styles.logoutBtn} onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
```

`Header` reads `user` and `logout` directly from `AuthContext` via `useContext`. No props required. This is the payoff of using context: `App.jsx` does not need to know that `Header` needs a user or a logout function.

### Step 5: Wire Everything Up

Wrap the app with `AuthProvider` in `src/main.jsx`:

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
```

Update `src/App.jsx` to gate the CRM behind the login screen. Add these imports and replace the opening of the return:

```jsx
// src/App.jsx — add these imports at the top
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import "./App.css";

function App() {
  const { user } = useContext(AuthContext);

  // All the existing useState calls stay here for now
  // ...

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="simple-crm">
      <Header />
      {/* everything else stays the same */}
    </div>
  );
}
```

**Browser check:**

- Open `http://localhost:5173`. You should see the login page.
- Log in with `daniel@simplesystems.io` / `password123`. The CRM should appear with the header showing the user's name.
- Try incorrect credentials. The error message should appear.
- Click Sign out. The login screen should reappear.
- Reload the page. You will be back at the login screen. This is expected; `user` lives in React state, which resets on every page load.

> **Common mistake:** forgetting to wrap `<App />` with `<AuthProvider>` in `main.jsx`. If you see an error like "Cannot destructure property 'user' of undefined", the component is calling `useContext(AuthContext)` but there is no provider above it in the tree.

---

## Part 3: useReducer, Centralising Customer State (30 minutes)

Now we tackle Problem 1. The Context API is not involved here; `useReducer` is a hook you can use anywhere, and we are going to use it inside `App.jsx` to replace the scattered `useState` calls.

### What is useReducer?

`useReducer` is an alternative to `useState` for managing state that has multiple related fields or complex update logic.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

Instead of calling multiple setter functions, you `dispatch` an **action**, a plain object describing what happened. The **reducer** is a pure function that receives the current state and the action and returns the new state.

```js
// An action is a plain object with a type and optional payload
dispatch({ type: "DELETE_CUSTOMER", payload: "c1" });
```

The reducer decides what the new state looks like:

```js
function reducer(state, action) {
  switch (action.type) {
    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter((c) => c.id !== action.payload),
      };
    // ...
  }
}
```

Two rules that a reducer must always follow:

1. It is a **pure function**: same inputs always produce the same output. No API calls, no `setTimeout`, no `localStorage` reads inside a reducer.
2. It must **never mutate** the existing state. Always return a new object with the spread operator so React detects the change.

### Which state belongs in the reducer?

Before writing the reducer, we need to decide what goes in it. Not every state variable from `App.jsx` needs to move.

The guiding principle is: **state that changes together belongs together**. When multiple state fields always update at the same time in response to the same event, they are a natural fit for a reducer. Fields that change independently in response to their own separate user actions are simpler to keep as plain `useState`.

Applying this to the eight state variables in `App.jsx`:

| State          | Belongs in reducer? | Reason                                                                        |
| -------------- | ------------------- | ----------------------------------------------------------------------------- |
| `customers`    | Yes                 | Core data; changes on every API operation                                     |
| `loading`      | Yes                 | Always flips together with `customers` on fetch                               |
| `error`        | Yes                 | Always clears on start, sets on failure, alongside `customers`                |
| `submitting`   | Yes                 | Flips together with `customers` on add                                        |
| `showForm`     | Yes                 | Flips to `false` together with `customers` and `submitting` on successful add |
| `searchTerm`   | No                  | Changes alone when the user types; independent                                |
| `statusFilter` | No                  | Changes alone when the user clicks a filter; independent                      |
| `selectedId`   | No                  | Changes alone when the user clicks a card; independent                        |

`searchTerm`, `statusFilter`, and `selectedId` will stay as plain `useState` calls in `App.jsx`. Note that `showForm` also changes alone when the user clicks the toggle button — a reducer case can update a single field just fine. The deciding factor is that it also needs to change _together_ with other state on a successful add.

### Step 1: Create the Reducer

Create `src/reducers/customerReducer.js`:

```js
// src/reducers/customerReducer.js

export const initialState = {
  customers: [],
  loading: false,
  error: null,
  submitting: false,
  showForm: false,
};

export function customerReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, customers: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "ADD_START":
      return { ...state, submitting: true };

    case "ADD_CUSTOMER":
      return {
        ...state,
        submitting: false,
        showForm: false,
        customers: [...state.customers, action.payload],
      };

    case "ADD_ERROR":
      // In a production app, this case would also set an addError field
      // to display inline feedback. Here we use alert() to keep the lesson focused.
      return { ...state, submitting: false };

    case "TOGGLE_FORM":
      return { ...state, showForm: !state.showForm };

    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };

    case "DELETE_CUSTOMER":
      return {
        ...state,
        customers: state.customers.filter((c) => c.id !== action.payload),
      };

    default:
      return state;
  }
}
```

The `ADD_CUSTOMER` case now closes the form (`showForm: false`), clears `submitting`, and appends the new customer in one atomic transition. Without a reducer, you would need to call three separate setters in sequence and hope none are forgotten.

### Step 2: Replace useState with useReducer in App.jsx

Replace the four coupled `useState` calls with `useReducer`, and keep the four independent ones as `useState`:

```jsx
// src/App.jsx — replace the useState imports and declarations
import { useReducer, useState, useEffect, useContext } from 'react';
import { customerReducer, initialState } from './reducers/customerReducer';
import { AuthContext } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import CustomerCard from './components/CustomerCard';
import CustomerDetail from './components/CustomerDetail';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';
import './App.css';

const ALL_TAGS = ['VIP', 'Lead', 'Referral'];
export const API_BASE = 'http://localhost:3001';

function App() {
  const { user } = useContext(AuthContext);

  // Coupled state — managed by the reducer
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const { customers, loading, error, submitting, showForm } = state;

  // Independent UI state — each changes on its own
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', status: 'active', tags: [] });
```

Now rewrite the handlers to use `dispatch` for the coupled operations:

```jsx
  useEffect(() => {
    const loadCustomers = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await fetch(`${API_BASE}/customers`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      }
    };
    loadCustomers();
  }, []);

  const filteredCustomers = customers
    .filter((c) => c.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((c) => statusFilter === 'all' || c.status === statusFilter);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const newCustomer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      status: form.status,
      tags: form.tags,
      company: '',
      notes: '',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    dispatch({ type: 'ADD_START' });
    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const created = await response.json();
      // ADD_CUSTOMER closes the form, clears submitting, and appends the customer in one step
      dispatch({ type: 'ADD_CUSTOMER', payload: created });
      setForm({ firstName: '', lastName: '', email: '', phone: '', status: 'active', tags: [] });
    } catch (err) {
      dispatch({ type: 'ADD_ERROR' });
      alert(`Failed to add customer: ${err.message}`);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      dispatch({ type: 'DELETE_CUSTOMER', payload: customerId });
      if (selectedId === customerId) setSelectedId(null);
    } catch (err) {
      alert(`Failed to delete customer: ${err.message}`);
    }
  };

  const handleUpdateCustomer = async (customerId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const updated = await response.json();
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updated });
    } catch (err) {
      alert(`Failed to update customer: ${err.message}`);
    }
  };

  if (!user) return <LoginPage />;
  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="simple-crm">
      <Header />

      <button
        className="toggle-form-btn"
        onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
      >
        {showForm ? 'Cancel' : 'Add Customer'}
      </button>

      {showForm && (
        <form onSubmit={handleAddCustomer} className="add-customer-form">
          {/* form fields — same as before */}
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Customer'}
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="filter-bar">
            {['all', 'active', 'inactive'].map((f) => (
              <button
                key={f}
                className={`filter-btn${statusFilter === f ? ' filter-btn-active' : ''}`}
                onClick={() => setStatusFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="customer-list">
            <h2>Customers ({filteredCustomers.length})</h2>
            {filteredCustomers.length === 0 ? (
              <p className="status-message">
                {searchTerm ? 'No customers match your search.' : 'No customers yet. Add one above!'}
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <CustomerDetail selectedId={selectedId} onUpdate={handleUpdateCustomer} />
      </div>
    </div>
  );
}

export default App;
```

> **Key observation:** Compare this `App.jsx` to the one from Lesson 2.5. The five coupled state variables are now managed by the reducer, and each handler dispatches actions instead of juggling multiple setters. It is impossible to forget to clear `error` before a fetch, or to forget to flip `submitting` back on success or failure — the reducer handles both in the right case. The three independent UI state variables stay as plain `useState`, keeping things simple where there is no coordination needed.

**Browser check:** Run `npm run dev` and `npm run server`. The app should behave identically to Lesson 2.5; every feature works exactly as before. The only difference is internal.

---

## Part 4: Combining Context and useReducer to Eliminate Prop Drilling (25 minutes)

Look at the current `App.jsx`. `handleDeleteCustomer` and `handleUpdateCustomer` are still defined here and still passed down as props to `CustomerCard` and `CustomerDetail`. The reducer solved Problem 1. Problem 2 is still there.

Now we move the reducer into a context so that `CustomerCard` and `CustomerDetail` can call actions directly, without receiving them as props.

### Step 1: Create CustomerContext

We are moving almost everything customer-related out of `App.jsx` and into this context:

- The reducer and its `dispatch`
- The independent UI state: `searchTerm`, `statusFilter`, `selectedId`
- The handler functions that call the API: `handleAddCustomer`, `handleDeleteCustomer`, `handleUpdateCustomer`
- The form toggle, previously an inline `onClick={() => dispatch({ type: 'TOGGLE_FORM' })}` in `App.jsx`, now named `toggleForm`

The `form` state stays behind in `App.jsx`. Only the Add Customer form reads it, so there is no prop drilling to solve there, and moving it would cause every context consumer to re-render on each keystroke.

Notice also that the handler functions are renamed as they move: `handleDeleteCustomer` becomes `deleteCustomer`, `handleUpdateCustomer` becomes `updateCustomer`, and the add logic becomes `addCustomer`. This is not a cosmetic change. The `handleX` prefix is a convention for a function wired directly into an event prop in the component that owns it, for example `onClick={handleDeleteCustomer}`. Once the function lives in a context, it is no longer a handler in that sense; it is an **action** exposed by the context's public API, similar to how a `setX` state setter is named as a verb rather than a handler. Components that consume the context call these actions from inside their own local handler, usually a short inline function:

```jsx
onClick={(e) => {
  e.stopPropagation();
  deleteCustomer(customer.id);
}}
```

That inline arrow function is the real click handler; `deleteCustomer` is the action it calls.

Create `src/contexts/CustomerContext.jsx`:

```jsx
// src/contexts/CustomerContext.jsx
import { createContext, useReducer, useState, useEffect } from "react";
import { customerReducer, initialState } from "../reducers/customerReducer";
import { API_BASE } from "../App";

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
  // Coupled state — managed by the reducer
  const [state, dispatch] = useReducer(customerReducer, initialState);
  const { customers, loading, error, submitting, showForm } = state;

  // Independent UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const response = await fetch(`${API_BASE}/customers`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };
    loadCustomers();
  }, []);

  const addCustomer = async (customerData) => {
    dispatch({ type: "ADD_START" });
    try {
      const response = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const created = await response.json();
      dispatch({ type: "ADD_CUSTOMER", payload: created });
    } catch (err) {
      dispatch({ type: "ADD_ERROR" });
      alert(`Failed to add customer: ${err.message}`);
    }
  };

  const toggleForm = () => dispatch({ type: "TOGGLE_FORM" });

  const updateCustomer = async (customerId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const updated = await response.json();
      dispatch({ type: "UPDATE_CUSTOMER", payload: updated });
    } catch (err) {
      alert(`Failed to update customer: ${err.message}`);
    }
  };

  const deleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      const response = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      dispatch({ type: "DELETE_CUSTOMER", payload: customerId });
      if (selectedId === customerId) setSelectedId(null);
    } catch (err) {
      alert(`Failed to delete customer: ${err.message}`);
    }
  };

  const filteredCustomers = customers
    .filter((c) => c.firstName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((c) => statusFilter === "all" || c.status === statusFilter);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        filteredCustomers,
        loading,
        error,
        submitting,
        showForm,
        searchTerm,
        statusFilter,
        selectedId,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleForm,
        setSearchTerm,
        setStatusFilter,
        setSelectedId,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
```

`filteredCustomers` is computed during render rather than stored in state. Derived values that can be calculated from existing state should never be stored separately; they would need to be kept in sync manually and would create a source of bugs. Deriving them during render is always correct and always up to date.

### Step 2: Add CustomerProvider to the Tree

Update `src/main.jsx`:

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
        <App />
      </CustomerProvider>
    </AuthProvider>
  </StrictMode>,
);
```

`AuthProvider` wraps `CustomerProvider` because the ordering matters: a provider can only read from contexts that are above it in the tree. If `CustomerProvider` ever needed to check who is logged in (for example, to attach a `createdBy` field), it would need `AuthContext` to be available above it.

### Step 3: Simplify App.jsx

Remove all customer state and callbacks from `App.jsx`. It now only orchestrates what to render:

```jsx
// src/App.jsx
import { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { CustomerContext } from "./contexts/CustomerContext";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import CustomerCard from "./components/CustomerCard";
import CustomerDetail from "./components/CustomerDetail";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import "./App.css";

const ALL_TAGS = ["VIP", "Lead", "Referral"];

function App() {
  const { user } = useContext(AuthContext);
  const {
    filteredCustomers,
    loading,
    error,
    submitting,
    showForm,
    searchTerm,
    statusFilter,
    selectedId,
    addCustomer,
    toggleForm,
    setSearchTerm,
    setStatusFilter,
    setSelectedId,
  } = useContext(CustomerContext);

  if (!user) return <LoginPage />;
  if (loading) return <Spinner />;
  if (error) return <p className="status-message error">Error: {error}</p>;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
    tags: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const newCustomer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      status: form.status,
      tags: form.tags,
      company: "",
      notes: "",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await addCustomer(newCustomer);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "active",
      tags: [],
    });
  };

  return (
    <div className="simple-crm">
      <Header />

      <button className="toggle-form-btn" onClick={toggleForm}>
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
              placeholder="e.g. sarah@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              placeholder="e.g. +65 9123 4567"
              value={form.phone}
              onChange={handleChange}
            />
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
          <div className="form-field">
            <label>Tags</label>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-toggle${form.tags.includes(tag) ? " tag-toggle-active" : ""}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      )}

      <div className="crm-layout">
        <div className="customer-panel">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
              <p className="status-message">
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
                    onSelect={setSelectedId}
                    isSelected={selectedId === customer.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <CustomerDetail selectedId={selectedId} />
      </div>
    </div>
  );
}

export default App;
```

`CustomerCard` no longer receives `onDelete`; it will read `deleteCustomer` from context directly. `CustomerDetail` no longer receives `onUpdate` either, but unlike `CustomerCard`, it does not need to read `updateCustomer` from context at all, since it never called that function itself. It only forwarded the prop to `CustomerEditForm`, which is the component that will read `updateCustomer` from context.

### Step 4: Update CustomerCard

Remove the `onDelete` prop and read `deleteCustomer` from `CustomerContext` instead. Also read `hasRole` from `AuthContext` to show the Delete button only to admins:

```jsx
// src/components/CustomerCard.jsx
import { useContext } from "react";
import { Mail, Phone } from "lucide-react";
import { CustomerContext } from "../contexts/CustomerContext";
import { AuthContext } from "../contexts/AuthContext";
import styles from "./CustomerCard.module.css";

function initials(firstName, lastName) {
  return (firstName[0] + lastName[0]).toUpperCase();
}

function CustomerCard({ customer, onSelect, isSelected }) {
  const { deleteCustomer } = useContext(CustomerContext);
  const { hasRole } = useContext(AuthContext);
  const { firstName, lastName, email, phone, status, tags } = customer;

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      onClick={() => onSelect(customer.id)}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>{initials(firstName, lastName)}</div>
        <div className={styles.nameBlock}>
          <p className={styles.name}>
            {firstName} {lastName}
          </p>
        </div>
        <span
          className={`${styles.badge} ${status === "active" ? styles.badgeActive : styles.badgeInactive}`}
        >
          {status}
        </span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <Mail size={14} />
          {email}
        </div>
        <div className={styles.metaRow}>
          <Phone size={14} />
          {phone}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        {hasRole("admin") && (
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              deleteCustomer(customer.id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomerCard;
```

### Step 5: Update CustomerDetail

In Lesson 2.5, `CustomerDetail` received `onUpdate` as a prop only to forward it, unused, straight through to `CustomerEditForm` via `onUpdate={onUpdate}`. It never called `onUpdate` itself. Now that `CustomerEditForm` can read `updateCustomer` from `CustomerContext` directly, that pass-through is no longer needed at all.

```jsx
// src/components/CustomerDetail.jsx — update the imports and props
import { useState, useEffect, useContext } from 'react';
import { CustomerContext } from '../contexts/CustomerContext';
import styles from './CustomerDetail.module.css';
import Spinner from './Spinner';

const API_BASE = 'http://localhost:3001';

function CustomerDetail({ selectedId }) {
  // no onUpdate prop and no updateCustomer needed here — CustomerDetail
  // never called it directly, it only forwarded it to CustomerEditForm
  // ... rest of the component stays the same
```

`CustomerEditForm` is the component that actually needs `updateCustomer`, so that is where it gets read from context:

```jsx
function CustomerEditForm({ customer, onDone }) {
  const { updateCustomer } = useContext(CustomerContext);
  // ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCustomer(customer.id, editForm);
      onDone(editForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };
```

And update the call site inside `CustomerDetail`. Remove `onUpdate` from the props passed to `CustomerEditForm`:

```jsx
{
  isEditing ? (
    <CustomerEditForm customer={customer} onDone={handleDone} />
  ) : (
    <CustomerView customer={customer} onEditClick={handleEditClick} />
  );
}
```

**Browser check:**

- All existing features work: load, search, filter, add, edit, delete.
- Log in as `daniel@simplesystems.io` (admin role). The Delete button should be visible on each card.
- Sign out and log in as `alice@simplesystems.io` (user role). The Delete button should be gone.
- Reload while logged in as either user. The session should be restored.

> **Key observation:** `App.jsx` no longer owns any customer state or passes any callbacks. `CustomerCard` and `CustomerDetail` get what they need directly from context. Adding a new component that needs to delete a customer, no matter how deeply nested, requires no changes to any intermediate component.

---

## Activity: Role Badge in the Header (15 minutes)

The header currently shows the logged-in user's name. Make the role visually distinct so admins can be identified at a glance.

**Task:**

1. Add a role badge element to `Header.jsx` next to the user's name
2. Apply a different CSS Module class depending on `user.role`, one for `admin` and one for `user`
3. Style both badges using tokens from `index.css`; give them a pill shape, a small font, and distinct background colours

**Hints:**

1. Read `user.role` from `useContext(AuthContext)`; it is already available in `Header`
2. Use a template literal to build the class name: `` `${styles.roleBadge} ${user.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeUser}` ``
3. CSS Module class names use camelCase: `.roleBadgeAdmin`, `.roleBadgeUser`
4. The role badge rules are already included in [`assets/Header.module.css`](assets/Header.module.css) if you need a reference for the CSS

<details>
<summary>Reference solution</summary>

In `Header.jsx`, add the badge after the user name:

```jsx
<div className={styles.userArea}>
  <span className={styles.userName}>{user.name}</span>
  <span
    className={`${styles.roleBadge} ${user.role === "admin" ? styles.roleBadgeAdmin : styles.roleBadgeUser}`}
  >
    {user.role}
  </span>
  <button className={styles.logoutBtn} onClick={logout}>
    Sign out
  </button>
</div>
```

The `.roleBadge`, `.roleBadgeAdmin`, and `.roleBadgeUser` rules are already in [`assets/Header.module.css`](assets/Header.module.css). Add them to your `src/components/Header.module.css`.

</details>

---

## Bonus Challenges

### Challenge 1: Context Helper with Error Guard

A common pattern is to wrap `useContext` in a function that throws a clear error if called outside its provider, rather than returning `undefined` silently. Add the following to `CustomerContext.jsx`:

```js
export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error("useCustomers must be used inside a CustomerProvider");
  }
  return ctx;
}
```

Do the same for `AuthContext`. Then update all components to call `useCustomers()` and `useAuth()` instead of `useContext(CustomerContext)` and `useContext(AuthContext)`. Deliberately call one of them outside its provider and observe the error message.

### Challenge 2: Separate Loading States

Right now, `FETCH_START` sets `loading: true` for the initial list fetch, but add and delete operations also use the same `loading` flag internally. Add dedicated per-operation states:

- `listLoading`: true only while the initial fetch is in progress
- Show a spinner only for the list fetch; add and delete operations use per-button disabled states instead

Add new action types (`LIST_FETCH_START`, `LIST_FETCH_SUCCESS`) and update the reducer and provider accordingly.

### Challenge 3: Optimistic Delete

Instead of waiting for the DELETE request to complete before updating the UI, remove the customer from state immediately and revert if the request fails:

1. `dispatch({ type: 'DELETE_CUSTOMER', payload: customerId })` before the `fetch`
2. If the fetch throws, dispatch a new `RESTORE_CUSTOMER` action with the original customer object
3. Add a `RESTORE_CUSTOMER` case to the reducer that adds the customer back

Add a simulated network delay (`await new Promise(r => setTimeout(r, 1000))`) and a simulated failure (`throw new Error('Network error')`) to test the revert.

---

## Summary

| Concept                     | What it does                               | When to use it                                      |
| --------------------------- | ------------------------------------------ | --------------------------------------------------- |
| `createContext`             | Creates a context object                   | Once per shared concern (auth, customers, theme)    |
| `Context.Provider`          | Makes a value available to all descendants | Wrap the part of the tree that needs access         |
| `useContext`                | Reads the nearest provider's value         | Any component that needs the context value          |
| `useReducer`                | Manages grouped state via a pure function  | Multiple related state fields; complex update logic |
| `dispatch` + action objects | Triggers a state transition                | Instead of calling multiple setters in sequence     |

The two problems from Part 1 are now solved:

- **Problem 1** (messy state): solved by `useReducer`. All state fields live in one object. All transitions are in one function. It is impossible to forget a step.
- **Problem 2** (prop drilling): solved by Context. `CustomerCard` and `CustomerDetail` read from context directly. No intermediate component is involved.

The pattern you have built, one context per concern, each backed by a reducer, is the foundation for how larger React applications manage state. Libraries like Zustand and Redux Toolkit follow the same shape.
