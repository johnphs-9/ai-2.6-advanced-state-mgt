# Optional Assignment: Budget Tracker

## Overview

- **Lesson:** Advanced State Management — Context API and Reducers / 2.6
- **Type:** Optional Take-Home Assignment
- **Estimated Time:** 2–3 hours
- **Due:** Before next lesson
- **Submission:** GitHub repository link or ZIP file

## Learning Objectives Covered

This assignment reinforces:

- Creating a context with a provider and consuming it via `useContext`
- Using `useReducer` to manage grouped state with multiple related fields
- Combining Context and `useReducer` so actions are available anywhere in the tree
- Applying role-based rendering to show different UI to different users
- Persisting state across page reloads using `localStorage`

## Assignment Description

Build a **Budget Tracker**: a small personal finance app where users can log income and expense transactions, view a running balance, and filter the transaction list. Two user roles have different capabilities — an admin can add and delete transactions, while a viewer can only read them.

This project is intentionally separate from the CRM so you can practise applying the same patterns to a new domain without copy-pasting.

### What You Will Build

A single-page application that:

- Shows a login screen with two mock users (admin and viewer)
- Displays the current balance, total income, and total expenses
- Shows a list of transactions with type (income/expense), description, and amount
- Allows admin users to add and delete transactions
- Filters the transaction list by type (all / income / expense)
- Persists the logged-in user in `localStorage`

## Requirements

### Core Requirements

#### 1. Project Setup

- [ ] Create a new React app using Vite: `npm create vite@latest budget-tracker -- --template react`
- [ ] Install no additional libraries — use only React and the browser's built-in `fetch` / `localStorage`

#### 2. Transaction Data Structure

Each transaction should have the following shape:

```js
{
  id: 1,
  description: 'Salary',
  amount: 3500,
  type: 'income',   // 'income' or 'expense'
}
```

Seed the app with at least 6 transactions (mix of income and expense) stored as the initial state in your reducer.

#### 3. Contexts to Create

**a) `AuthContext`**

- [ ] Provide `user`, `login`, and `logout`
- [ ] Two mock users: `{ id: 1, username: 'admin', role: 'admin', name: 'Admin User' }` and `{ id: 2, username: 'viewer', role: 'viewer', name: 'Viewer' }`
- [ ] Persist the logged-in user in `localStorage` using `useEffect`
- [ ] Show a neutral loading state while `localStorage` is being checked on mount

**b) `BudgetContext`**

- [ ] Backed by `useReducer` with a `budgetReducer`
- [ ] Provide `transactions`, `filteredTransactions`, `filter`, `addTransaction`, `deleteTransaction`, and `setFilter`
- [ ] `filteredTransactions` should be derived during render, not stored in state

#### 4. Reducer to Create

`budgetReducer` should handle these actions:

| Action type | Payload | Effect |
|---|---|---|
| `ADD_TRANSACTION` | transaction object | Append to `transactions` |
| `DELETE_TRANSACTION` | transaction `id` | Remove from `transactions` |
| `SET_FILTER` | `'all'`, `'income'`, or `'expense'` | Update `filter` |

Initial state:

```js
{
  transactions: [ /* your seed data */ ],
  filter: 'all',
}
```

#### 5. Components to Create

**a) `Login`** — form with username and password fields; validates against mock users; calls `login` from `AuthContext`

**b) `Header`** — shows app name, logged-in user's name and role, and a Log Out button

**c) `Summary`** — reads `transactions` from `BudgetContext`; displays three values:
  - Total balance (income minus expenses)
  - Total income
  - Total expenses

**d) `FilterBar`** — three buttons: All / Income / Expense; calls `setFilter` from `BudgetContext`; highlights the active filter

**e) `TransactionList`** — renders `filteredTransactions` from `BudgetContext`; each row shows description, amount, and type; admin users see a Delete button on each row

**f) `AddTransactionForm`** — visible to admin users only; controlled form with description (text), amount (number), and type (select: income/expense); calls `addTransaction` from `BudgetContext` on submit; clears on success

#### 6. App Component

- [ ] Reads `user` from `AuthContext`; shows `Login` if no user is logged in
- [ ] Fetches no data from a server — all state starts from the reducer's `initialState`
- [ ] Renders `Header`, `Summary`, `FilterBar`, `TransactionList`
- [ ] Renders `AddTransactionForm` only for admin users

### Stretch Goals

- [ ] Persist transactions in `localStorage` so they survive a page reload (hint: use `useEffect` in `BudgetContext` to save and restore)
- [ ] Add an edit transaction flow: clicking a transaction opens an inline form pre-filled with its data; submitting dispatches an `UPDATE_TRANSACTION` action
- [ ] Display a running balance chart using only HTML and CSS (no chart library) — a simple bar or list of coloured rows is sufficient
- [ ] Add a `sessionStorage`-backed option: if the user checks a "Remember me" checkbox on login, use `localStorage`; otherwise use `sessionStorage`

## Example Seed Data

```js
const initialTransactions = [
  { id: 1, description: 'Salary',          amount: 3500, type: 'income'  },
  { id: 2, description: 'Rent',            amount: 1200, type: 'expense' },
  { id: 3, description: 'Freelance work',  amount: 800,  type: 'income'  },
  { id: 4, description: 'Groceries',       amount: 250,  type: 'expense' },
  { id: 5, description: 'Electricity bill',amount: 90,   type: 'expense' },
  { id: 6, description: 'Bonus',           amount: 500,  type: 'income'  },
];
```

## Resources

- [React docs: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React docs: Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [React docs: Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
