# Assessment / Quiz

## Overview

- **Lesson:** Advanced State Management — Context API and Reducers / 2.6
- **Format:** 30 questions (mix MCQ / True-False)
- **Time:** ~30 minutes
- **Scoring:** 1 point each

## Questions

### Q1 (True/False)

The Context API eliminates the need to pass props through intermediate components that do not use the data.

A - True

B - False

---

### Q2

What does `createContext()` return?

A - A React component that renders its children

B - A context object with a `Provider` property used to supply values to the tree

C - A hook that reads state from a parent component

D - A special version of `useState` accessible to all components

---

### Q3

In the CRM app, `AuthContext` is exported from `AuthContext.jsx`. Which import is correct when consuming it in `Header.jsx`?

A - `import AuthContext from '../contexts/AuthContext'`

B - `import { AuthContext } from '../contexts/AuthContext'`

C - `import { useContext } from '../contexts/AuthContext'`

D - `import AuthProvider from '../contexts/AuthContext'`

---

### Q4 (True/False)

A component can only read context values from a `Provider` that is a direct parent — not a grandparent or higher ancestor.

A - True

B - False

---

### Q5

Which of the following correctly reads the `user` value from `AuthContext`?

A - `const user = AuthContext.user`

B - `const { user } = useState(AuthContext)`

C - `const { user } = useContext(AuthContext)`

D - `const user = useContext('AuthContext')`

---

### Q6

A developer wraps only part of the component tree with `<AuthProvider>`. What happens to components outside the provider that call `useContext(AuthContext)`?

A - They receive the last value the provider produced before unmounting

B - They receive `undefined` because no provider is found above them in the tree

C - React throws a build error during compilation

D - They automatically receive the default value passed to `createContext()`

---

### Q7 (True/False)

Both `AuthContext` (which uses `useState`) and `CustomerContext` (which uses `useReducer`) are valid uses of the Context API — context works with any state management approach inside the provider.

A - True

B - False

---

### Q8

In the lesson, `AuthProvider` is placed above `CustomerProvider` in `main.jsx`. Why does the order matter?

A - React requires all providers to be listed alphabetically

B - Providers higher in the tree are available to providers lower in the tree; `CustomerProvider` may eventually need to read from `AuthContext`

C - The browser renders outer providers before inner ones, which affects CSS

D - React batches state updates differently depending on provider nesting order

---

### Q9

After a user logs in, the CRM stores the user object in `localStorage`. Which code correctly saves and retrieves it?

A -
```js
localStorage.setItem('user', user);
const u = localStorage.getItem('user');
```

B -
```js
localStorage.setItem('user', JSON.stringify(user));
const u = JSON.parse(localStorage.getItem('user'));
```

C -
```js
localStorage.user = user;
const u = localStorage.user;
```

D -
```js
localStorage.setItem('user', user.toString());
const u = JSON.parse(localStorage.getItem('user'));
```

---

### Q10 (True/False)

`localStorage` data is cleared automatically when the user closes the browser tab.

A - True

B - False

---

### Q11

A user logs into the CRM, closes the browser, and reopens it the next day. With `localStorage` used to persist the session, what will they see?

A - The login form, because `localStorage` does not survive a browser restart

B - The CRM dashboard, because `localStorage` persists across browser restarts

C - An error, because `localStorage` cannot store objects

D - The login form, because React state resets on every page load regardless of `localStorage`

---

### Q12

What is the key difference between `localStorage` and `sessionStorage`?

A - `localStorage` stores strings only; `sessionStorage` stores any JavaScript value

B - `sessionStorage` is cleared when the tab is closed; `localStorage` persists across browser restarts

C - `localStorage` is shared between tabs; `sessionStorage` is shared between browser windows

D - `sessionStorage` requires a server; `localStorage` is purely client-side

---

### Q13

In `AuthProvider`, a `loading` state is set to `true` initially and switched to `false` after `localStorage` is checked inside `useEffect`. Why is this necessary?

A - Without it, the `useEffect` will run before the component mounts

B - Without it, the app would briefly render the login form before the stored user is applied, causing a visible flash

C - `localStorage` is asynchronous and requires the component to pause rendering

D - React requires all providers to indicate a loading state before supplying values

---

### Q14 (True/False)

`useReducer` can only be used inside a context provider — it cannot be used in a regular component.

A - True

B - False

---

### Q15

What is the correct syntax for `useReducer`?

A - `const [state, dispatch] = useReducer(initialState, reducer)`

B - `const [dispatch, state] = useReducer(reducer, initialState)`

C - `const [state, dispatch] = useReducer(reducer, initialState)`

D - `const { state, dispatch } = useReducer(reducer, initialState)`

---

### Q16

A reducer receives the current state and an action, and returns the next state. Which of the following is a valid reducer?

A -
```js
function reducer(state, action) {
  state.count += 1;
  return state;
}
```

B -
```js
function reducer(state, action) {
  if (action.type === 'INCREMENT') {
    return { ...state, count: state.count + 1 };
  }
  return state;
}
```

C -
```js
async function reducer(state, action) {
  const data = await fetch('/api');
  return { ...state, data };
}
```

D -
```js
function reducer(action, state) {
  return { ...state, count: state.count + 1 };
}
```

---

### Q17 (True/False)

A reducer must be a pure function: given the same state and action, it must always return the same new state, with no side effects.

A - True

B - False

---

### Q18

The customer reducer handles a `DELETE_CUSTOMER` action where `action.payload` is the customer's `id`. Which implementation is correct?

A - `return { ...state, customers: state.customers.splice(action.payload, 1) }`

B - `return { ...state, customers: state.customers.filter(c => c.id !== action.payload) }`

C - `return { ...state, customers: state.customers.filter(c => c.id === action.payload) }`

D - `state.customers.pop(); return state;`

---

### Q19

What does `dispatch({ type: 'FETCH_SUCCESS', payload: data })` do?

A - It calls the reducer directly and updates state synchronously

B - It sends the action object to the reducer, which returns the new state, and React re-renders the component

C - It fetches data from the API and stores it in state

D - It calls `setState` with the payload value

---

### Q20

Which of the following correctly dispatches an action to signal the start of a fetch operation?

A - `dispatch('FETCH_START')`

B - `reducer({ type: 'FETCH_START' })`

C - `dispatch({ type: 'FETCH_START' })`

D - `setState({ type: 'FETCH_START' })`

---

### Q21

In the customer reducer, the `FETCH_START` case returns `{ ...state, loading: true, error: null }`. Why is `error` reset to `null` here?

A - The reducer requires all fields to be explicitly set on every action

B - A new fetch attempt should clear any previous error so stale error messages do not linger on screen

C - Setting `error: null` prevents the `try` block from catching errors

D - `loading: true` only takes effect if `error` is `null`

---

### Q22 (True/False)

In the CRM, `filteredCustomers` is computed during render from `state.customers` and `state.searchQuery`. This is correct — derived values should not be stored as separate state.

A - True

B - False

---

### Q23

`CustomerProvider` stores the customer list in context using `useReducer`. What is the consequence of this for components that consume `CustomerContext`?

A - Only the component that dispatched an action re-renders; other consumers are unaffected

B - All components that consume `CustomerContext` re-render whenever customer state changes

C - Re-renders are prevented automatically because `useReducer` batches updates

D - Context consumers never re-render; they read state on demand

---

### Q24

A `CustomerCard` component needs to call `deleteCustomer` when the Delete button is clicked. In the refactored CRM, how does it access this function?

A - It receives `deleteCustomer` as a prop passed down from `App`

B - It imports `deleteCustomer` directly from `customerReducer.js`

C - It calls `useContext(CustomerContext)` to read `deleteCustomer` from the context value

D - It dispatches a `DELETE_CUSTOMER` action directly without going through the context

---

### Q25 (True/False)

Role-based rendering in the CRM — showing the Add Customer form to admins only — is implemented by conditionally rendering JSX based on `user.role` read from `AuthContext`.

A - True

B - False

---

### Q26

Which of the following correctly renders the Add Customer form only for admin users?

A - `<AddCustomerForm role="admin" />`

B - `{ user.role && <AddCustomerForm /> }`

C - `{ user.role === 'admin' && <AddCustomerForm /> }`

D - `<AddCustomerForm visible={true} />`

---

### Q27

A learner accidentally puts the `<CustomerProvider>` above the `<AuthProvider>` in `main.jsx`. What practical problem could this cause?

A - The app will not compile because React requires alphabetical provider ordering

B - `CustomerProvider` cannot access `AuthContext` values if it ever needs to, because `AuthProvider` is now a child, not an ancestor

C - Components inside `CustomerProvider` will not be able to read `CustomerContext`

D - `useReducer` will not work inside `CustomerProvider` without `AuthProvider` above it

---

### Q28 (True/False)

Context is appropriate for storing mouse cursor position because it changes many times per second and needs to be shared across the whole app.

A - True

B - False

---

### Q29

A learner adds a `ThemeContext` to the CRM that stores the current colour theme. The theme changes only when the user clicks a toggle button. Is this an appropriate use of context?

A - No, because themes should always be stored in `localStorage` instead

B - No, because context should only be used for authentication state

C - Yes, because theme is global UI state that many components may need, and it changes infrequently

D - Yes, but only if the theme is also backed by `useReducer`

---

### Q30

A learner writes the following component. What is the bug?

```jsx
import { CustomerContext } from '../contexts/CustomerContext';

function CustomerSearch() {
  const { searchQuery, setSearchQuery } = CustomerContext;

  return (
    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
  );
}
```

A - `CustomerContext` cannot be imported into a component file

B - `searchQuery` and `setSearchQuery` do not exist on the context object

C - The component reads from the context object directly instead of calling `useContext(CustomerContext)`, so `searchQuery` and `setSearchQuery` will be `undefined`

D - `onChange` must use a named function, not an arrow function

---
