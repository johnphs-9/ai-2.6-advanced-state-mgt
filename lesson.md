# Lesson 2.6: Advanced State Management — Context API and Reducers

## Overview

- **Duration:** ~2 hours (hands-on lab)
- **Prerequisites:** Lesson 2.5 - Lists, Asynchronous Programming, and Side Effects

## Learning Objectives

By the end of this lesson, you will be able to:

1. **Use** the Context API to share state across components without prop drilling
2. **Use** `useReducer` to manage complex, related state in a single place
3. **Combine** Context and `useReducer` to share state and actions across components
4. **Apply** role-based rendering to show different UI to different users

## Introduction

At the end of Lesson 2.5, all of your CRM state lives in `App.jsx`: customers, loading, error, search, and form fields. Every component that needs any of this data must receive it as a prop, and every callback must be passed down the same way.

That worked fine for a small app, but your CRM is about to grow. You need user authentication, permissions, and the ability to access customer data in components that are deeply nested. Passing props all the way down becomes painful, error-prone, and hard to change.

In this lesson you will solve those problems with two React tools:

- **Context API** - makes a value available to any component in the tree without passing it through props
- **`useReducer`** - centralises complex state and the logic that updates it into one place

By the end of the lab, your CRM will have a login page, a user-aware header, and role-based UI that shows different options to admin users versus regular users.

---

## Part 1: Setting Up the Project (5 minutes)

### Starting Point

Make sure both servers from Lesson 2.5 are still working:

```bash
# Terminal 1: React dev server
npm run dev

# Terminal 2: json-server
npm run server
```

Confirm you can see the customer list at `http://localhost:5173` and the raw API at `http://localhost:3001/customers`.

### Folder Structure

You will create two new folders inside `src/`:

```
src/
├── contexts/
│   ├── AuthContext.jsx
│   └── CustomerContext.jsx
├── reducers/
│   └── customerReducer.js
├── components/
│   ├── Login.jsx           (new)
│   ├── Header.jsx          (new)
│   ├── CustomerCard.jsx    (existing)
│   └── AddCustomerForm.jsx (new — extracted from App)
└── App.jsx
```

Create the folders now:

```bash
mkdir -p src/contexts src/reducers
```

---

## Part 2: AuthContext — User Authentication (35 minutes)

### What Problem Are We Solving?

Right now, if we added a `user` variable to `App.jsx`, we would have to pass it down as a prop to `Header`, then to `Sidebar`, then to `Navigation`, even though only the last component actually uses it. That is **prop drilling**.

`AuthContext` will hold the current user and make it available to any component directly — no props required.

### Step 1: Create AuthContext

Create `src/contexts/AuthContext.jsx`. We will start simple — just `useState` to track the logged-in user, with no persistence yet:

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  function hasRole(role) {
    return user?.role === role;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
```

A few things to notice:

- `AuthContext` is exported so that any component can pass it to `useContext` to read the value.
- The provider wraps its `children` — anything rendered inside `<AuthProvider>` will have access to the context value.
- `login`, `logout`, and `hasRole` are plain functions defined inside the provider. They are included in the `value` object so that any component can call them directly.

### Step 2: Wrap the App with AuthProvider

Open `src/main.jsx` and wrap the root render:

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
```

### Step 3: Create the Login Component

Create `src/components/Login.jsx`:

```jsx
// src/components/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin', name: 'Admin User', role: 'admin', email: 'admin@crm.com' },
  { id: 2, username: 'user',  password: 'user',  name: 'Regular User', role: 'user',  email: 'user@crm.com' },
];

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const match = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    if (match) {
      const { password: _omit, ...userData } = match;
      login(userData);
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="login-container">
      <h2>CRM Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Log In</button>
      </form>
      <p className="login-hint">Hint: admin / admin or user / user</p>
    </div>
  );
}

export default Login;
```

We keep authentication simple for now: a hardcoded list of users checked in the browser. In a real application this would be a POST request to a backend that returns a token. The pattern — call `login()` on success, which updates the context — is exactly the same.

Note how the password is stripped from the object before calling `login()`. You never want a password sitting in React state.

### Step 4: Update App to Use Authentication

Replace the contents of `src/App.jsx` with this:

```jsx
// src/App.jsx
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Login';

function App() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="simple-crm">
      <p>Welcome, {user.name}! (role: {user.role})</p>
      <p>Customer CRM content goes here...</p>
    </div>
  );
}

export default App;
```

**Browser check:** Open `http://localhost:5173`. You should see the login form. Log in with `admin` / `admin`. The login form should disappear and you should see the welcome message.

Now try reloading the page. Notice that you are logged out and the login form appears again. This is expected — the user is stored only in React state, which resets on every page load. We will fix this shortly.

To test the error state, try entering wrong credentials. You should see the error message.

### Step 5: Discover the Persistence Problem

The reload issue you just saw is a real problem for users. Imagine having to log in every time you refresh a tab. We need to save the login somewhere that survives a page reload.

### Browser Storage: localStorage and sessionStorage

Browsers provide two built-in key-value stores for saving small pieces of data:

| | `localStorage` | `sessionStorage` |
|---|---|---|
| **Survives page reload?** | Yes | Yes |
| **Survives closing the tab?** | Yes | No — cleared when the tab closes |
| **Survives closing the browser?** | Yes | No |
| **Shared across tabs?** | Yes | No — each tab has its own copy |
| **Cleared by logout?** | Only if you remove it manually | Only if you remove it manually |

Both stores use the same API:

```js
// Save a value (must be a string)
localStorage.setItem('key', 'value');

// Read a value
localStorage.getItem('key'); // returns null if not found

// Remove a value
localStorage.removeItem('key');
```

Because `setItem` only accepts strings, you use `JSON.stringify` to save objects and `JSON.parse` to read them back:

```js
// Saving an object
localStorage.setItem('crmUser', JSON.stringify({ name: 'Alice', role: 'admin' }));

// Reading it back
const stored = localStorage.getItem('crmUser');
const user = stored ? JSON.parse(stored) : null;
```

You can inspect what is currently stored in `localStorage` by opening DevTools, going to the **Application** tab, and selecting **Local Storage** in the sidebar.

For our CRM we will use `localStorage` so that users stay logged in even after closing and reopening the browser. Use `sessionStorage` when you want the session to end automatically when the tab is closed — for example, in a banking application.

### Step 6: Add Persistence to AuthContext

Update `src/contexts/AuthContext.jsx` to save and restore the user from `localStorage`. We use `useEffect` to read from storage once when the provider first mounts, just as we used it to fetch data from the API in Lesson 2.5:

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if the user already logged in during a previous session
  useEffect(() => {
    const stored = localStorage.getItem('crmUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem('crmUser', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('crmUser');
  }

  function hasRole(role) {
    return user?.role === role;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
```

The `loading` state is necessary because reading from `localStorage` and updating state is not instant — there is a brief moment between when the provider first renders (with `user = null`) and when the `useEffect` runs. Without the `loading` guard, the app would flash the login form for a split second before showing the CRM. Returning a placeholder during that moment prevents the flash.

> **Common mistake:** returning `null` from the provider while loading. If the provider returns `null`, all children are unmounted and then remounted once loading completes, causing a second `useEffect` to fire in child components. A simple `<p>Loading...</p>` avoids this.

**Browser check:** Log in as `admin`. Reload the page. You should now stay logged in. Open DevTools, go to **Application > Local Storage**, and you should see the `crmUser` key with your user data stored as JSON. Click the Log Out button (we will add it to the header shortly); then check Local Storage again — the key should be gone.

---

## Part 3: Customer Reducer (20 minutes)

Before building the `CustomerContext`, we need a reducer to manage customer state.

### Why useReducer?

`useReducer` is a React hook that can be used anywhere `useState` can be used — inside a regular component, inside a context provider, or anywhere else. It is not tied to the Context API. We are introducing both tools in the same lesson because they complement each other well, but you can use `useReducer` in a single component with no context at all, just as you can use context with plain `useState` (as we did with `AuthContext`).

At the end of Lesson 2.5, `App.jsx` had multiple separate `useState` calls for customers, loading, error, and search. Each API operation required setting several of those in the right order:

```jsx
// Current pattern: easy to get state out of sync
async function handleAdd(e) {
  setSubmitting(true);
  setError(null);       // must remember to clear this
  try {
    // ...
    setCustomers([...customers, created]);
    setFirstName('');
    setLastName('');
    setEmail('');
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
}
```

With `useReducer`, all state fields are grouped into one object and all transitions are described in one pure function. The async function only needs to call `dispatch` with a description of what happened; it does not need to know how state is structured.

### Step 1: Create the Reducer

Create `src/reducers/customerReducer.js`:

```js
// src/reducers/customerReducer.js

export const initialState = {
  customers: [],
  loading: false,
  error: null,
  searchQuery: '',
};

export function customerReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, customers: action.payload };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };

    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload),
      };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}
```

A reducer must follow two rules:

1. It is a **pure function** — same inputs always produce the same output. No API calls, no `setTimeout`, no `localStorage` reads inside a reducer.
2. It must **never mutate** the existing state. Every case returns a new object using the spread operator (`...state`) so React knows the value changed and can trigger a re-render.

### Step 2: Understand the Action Pattern

Every action is a plain object with a `type` string and an optional `payload`. The `type` describes what happened; the `payload` carries any data needed to compute the new state:

```js
// Signal that a fetch is starting — no data needed
dispatch({ type: 'FETCH_START' });

// Signal success and hand over the data
dispatch({ type: 'FETCH_SUCCESS', payload: customers });

// Signal that a new customer was created — hand over the new record
dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });

// Signal deletion — only the ID is needed
dispatch({ type: 'DELETE_CUSTOMER', payload: customerId });
```

---

## Part 4: CustomerContext — Global Customer State (25 minutes)

Now we combine the reducer with a context so any component can read customer state and call actions.

### Step 1: Create CustomerContext

Create `src/contexts/CustomerContext.jsx`:

```jsx
// src/contexts/CustomerContext.jsx
import { createContext, useReducer } from 'react';
import { customerReducer, initialState } from '../reducers/customerReducer';

export const CustomerContext = createContext();
const API_BASE = 'http://localhost:3001';

export function CustomerProvider({ children }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  async function fetchCustomers() {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch(`${API_BASE}/customers`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: await res.json() });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }

  async function addCustomer(customerData) {
    try {
      const res = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      if (!res.ok) throw new Error(`Failed to add customer: ${res.status}`);
      const created = await res.json();
      dispatch({ type: 'ADD_CUSTOMER', payload: created });
      return created;
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
      throw err;
    }
  }

  async function deleteCustomer(customerId) {
    try {
      const res = await fetch(`${API_BASE}/customers/${customerId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to delete customer: ${res.status}`);
      dispatch({ type: 'DELETE_CUSTOMER', payload: customerId });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
      throw err;
    }
  }

  function setSearchQuery(query) {
    dispatch({ type: 'SET_SEARCH', payload: query });
  }

  const filteredCustomers = state.searchQuery
    ? state.customers.filter(c => {
        const q = state.searchQuery.toLowerCase();
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      })
    : state.customers;

  const value = {
    customers: state.customers,
    filteredCustomers,
    loading: state.loading,
    error: state.error,
    searchQuery: state.searchQuery,
    fetchCustomers,
    addCustomer,
    deleteCustomer,
    setSearchQuery,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}
```

> **Note:** `filteredCustomers` is computed during render rather than stored in state. Computed values that are derived from existing state should never be put into state — they would need to be kept in sync manually and would create redundancy. Deriving them during render is always correct and always up to date.

> **A note on performance:** Storing frequently-changing state (like the customer list) directly in context means every component that consumes `CustomerContext` will re-render whenever any customer operation runs — a fetch, an add, or a delete. For a small CRM with a handful of components this is not a problem. In a larger app with many consumers you would split this to avoid unnecessary re-renders. We will cover exactly how to do that in the performance lesson.

### Step 2: Add CustomerProvider to the Tree

Update `src/main.jsx`:

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
        <App />
      </CustomerProvider>
    </AuthProvider>
  </StrictMode>
);
```

`AuthProvider` wraps `CustomerProvider` because providers higher in the tree are available to providers lower in the tree. If `CustomerProvider` ever needs to read the current user, it can do so because `AuthProvider` is above it.

---

## Part 5: Building the CRM UI with Context (30 minutes)

Now we rebuild the CRM components to read directly from context. No more prop drilling.

### Step 1: Create the Header Component

Create `src/components/Header.jsx`:

```jsx
// src/components/Header.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="crm-header">
      <h1>Simple CRM</h1>
      <div className="user-info">
        <span>Welcome, {user.name}</span>
        <span className="role-badge">{user.role}</span>
        <button onClick={logout} className="btn-logout">Log Out</button>
      </div>
    </header>
  );
}

export default Header;
```

### Step 2: Create the AddCustomerForm Component

Extract the add-customer form from `App.jsx` into its own component. Create `src/components/AddCustomerForm.jsx`:

```jsx
// src/components/AddCustomerForm.jsx
import { useState, useContext } from 'react';
import { CustomerContext } from '../contexts/CustomerContext';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  contactNo: '',
  jobTitle: '',
  yearOfBirth: '',
};

function AddCustomerForm() {
  const { addCustomer } = useContext(CustomerContext);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addCustomer(formData);
      setFormData(EMPTY_FORM);
    } catch {
      alert('Failed to add customer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-customer-form">
      <h3>Add New Customer</h3>
      <input name="firstName"   value={formData.firstName}   onChange={handleChange} placeholder="First Name"    required disabled={submitting} />
      <input name="lastName"    value={formData.lastName}    onChange={handleChange} placeholder="Last Name"     required disabled={submitting} />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email"       required disabled={submitting} />
      <input name="contactNo"   value={formData.contactNo}   onChange={handleChange} placeholder="Phone"                 disabled={submitting} />
      <input name="jobTitle"    value={formData.jobTitle}    onChange={handleChange} placeholder="Job Title"             disabled={submitting} />
      <input name="yearOfBirth" type="number" value={formData.yearOfBirth} onChange={handleChange}
        placeholder="Year of Birth" min="1900" max={new Date().getFullYear()} disabled={submitting} />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Customer'}
      </button>
    </form>
  );
}

export default AddCustomerForm;
```

### Step 3: Update CustomerCard to Read from Context

Open `src/components/CustomerCard.jsx`. Instead of receiving `onDelete` as a prop, the card reads `deleteCustomer` directly from `CustomerContext`, and reads `hasRole` from `AuthContext` to decide whether to show the Delete button:

```jsx
// src/components/CustomerCard.jsx
import { useState, useContext } from 'react';
import { CustomerContext } from '../contexts/CustomerContext';
import { AuthContext } from '../contexts/AuthContext';

function CustomerCard({ customer }) {
  const { deleteCustomer } = useContext(CustomerContext);
  const { hasRole } = useContext(AuthContext);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) return;
    setDeleting(true);
    try {
      await deleteCustomer(customer.id);
    } catch {
      alert('Failed to delete customer. Please try again.');
      setDeleting(false);
    }
  }

  return (
    <div className="customer-card">
      <p className="customer-name">{customer.firstName} {customer.lastName}</p>
      <p>{customer.email}</p>
      <p>Phone: {customer.contactNo || 'N/A'}</p>
      <p>Job: {customer.jobTitle || 'N/A'}</p>
      {hasRole('admin') && (
        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </div>
  );
}

export default CustomerCard;
```

Note that `onDelete` no longer needs to be passed as a prop from the parent. The card reads `deleteCustomer` directly from context. This is the key payoff: deeply nested components can access shared actions without any intermediate component being aware of them.

### Step 4: Rewrite App.jsx

Replace the contents of `src/App.jsx` with the final version that brings everything together:

```jsx
// src/App.jsx
import { useContext, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { CustomerContext } from './contexts/CustomerContext';
import Header from './components/Header';
import Login from './components/Login';
import AddCustomerForm from './components/AddCustomerForm';
import CustomerCard from './components/CustomerCard';

function App() {
  const { user } = useContext(AuthContext);
  const {
    filteredCustomers,
    loading,
    error,
    searchQuery,
    fetchCustomers,
    setSearchQuery,
  } = useContext(CustomerContext);

  useEffect(() => {
    if (user) fetchCustomers();
  }, [user]); // re-run whenever the logged-in user changes

  if (!user) {
    return <Login />;
  }

  if (loading) return <p className="status-message">Loading customers...</p>;
  if (error)   return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="simple-crm">
      <Header />

      {user.role === 'admin' && <AddCustomerForm />}

      <div className="customer-list">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <h2>Customers ({filteredCustomers.length})</h2>
        <div className="customers">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
```

Compare this to the `App.jsx` you had at the end of Lesson 2.5. The component no longer owns any customer state. It does not manage fetch logic, form state, or delete callbacks. It reads from context and renders the appropriate components.

**Browser check:** Log in as `admin`. You should see the header with your name and role, the Add Customer form, the search bar, and the customer list. Verify:

- Customers load from `http://localhost:3001/customers`
- The search bar filters cards in real time
- The Add Customer form adds a customer and the new card persists on reload
- The Delete button is visible and works
- Log out, then log in as `user`. The Add Customer form and Delete buttons should not be visible.

---

## Activity: Role Badge Styling (15 minutes)

The `Header` component displays the current user's role as plain text inside a `<span>`. Make it visually distinct so admins and regular users can be told apart at a glance.

**Task:**

1. Update the `role-badge` span in `Header.jsx` to apply a different CSS class depending on the role
2. Add CSS rules for `.role-badge--admin` and `.role-badge--user` with different background colours
3. Give the badge rounded corners, some padding, and capitalised text

**Hints:**

1. Use a template literal to build the class name dynamically: `` `role-badge role-badge--${user.role}` ``
2. The `user.role` value is either `'admin'` or `'user'`, so two CSS rules cover all cases
3. Add the CSS to `App.css` or create a dedicated `Header.css` and import it in `Header.jsx`

<details>
<summary>Reference solution</summary>

In `Header.jsx`, update the span:

```jsx
<span className={`role-badge role-badge--${user.role}`}>{user.role}</span>
```

In your CSS file:

```css
.role-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-left: 8px;
}

.role-badge--admin {
  background-color: #2563eb;
  color: #ffffff;
}

.role-badge--user {
  background-color: #e5e7eb;
  color: #374151;
}
```

</details>

---

## Bonus Challenges

### Challenge 1: Empty State per Role

When a regular user views the customer list and no results match the search, show: "No customers match your search." When the search is empty and there are truly no customers, show: "No customers yet."

For an admin with no results, show the same messages but add a nudge: "Add a customer using the form above."

### Challenge 2: sessionStorage Login

Change `AuthContext` to use `sessionStorage` instead of `localStorage`. Log in, reload the page — you should stay logged in. Close the tab and open a new one — you should be logged out. Then switch back to `localStorage` and consider: which storage type is more appropriate for a CRM used at a shared workstation?

### Challenge 3: Loading State per Operation

Right now, the entire list shows a loading state whenever any operation is in-flight because `FETCH_START` sets `loading: true` for add and delete operations too. Separate the loading states:

- `listLoading` — true only while the initial customer list is being fetched
- Individual add and delete operations should use per-form or per-card local state instead

Update the reducer to use a dedicated `LIST_FETCH_START` action type and update the components accordingly.

### Challenge 4: Edit Customer (Advanced)

Add an Edit button to each customer card. Clicking it opens an inline form pre-filled with the customer's data. Submitting sends a `PUT` request to `/customers/:id` and updates the card in place.

**Hints:**
- Add an `UPDATE_CUSTOMER` case to the reducer: `customers.map(c => c.id === action.payload.id ? action.payload : c)`
- Add an `updateCustomer` function to `CustomerContext` that sends `PUT /customers/:id`
- Track `isEditing` in local state inside `CustomerCard` — this does not need to be global

---

## Summary

| Concept | What it does | When to use it |
|---|---|---|
| `createContext` | Creates a context object that components can read | Once per shared concern (auth, customers, theme) |
| `Context.Provider` | Makes a value available to all components inside it | Wrap the part of the tree that needs access |
| `useContext` | Reads the nearest provider's value | Any component that needs the context value |
| `useReducer` | Manages grouped state via a pure function | Multiple related state fields, complex update logic |
| `dispatch` + action objects | Triggers a state transition in the reducer | Instead of calling multiple `setState` calls in sequence |
| `localStorage` | Persists data across page reloads and browser restarts | Login sessions, user preferences |
| `sessionStorage` | Persists data within a single browser tab session | Short-lived sessions that should end when the tab closes |

The pattern you have built — one context per concern, each backed by a reducer — is the foundation for how large React applications manage state. When you encounter libraries like Zustand or Redux Toolkit later, you will find they follow the same shape.
