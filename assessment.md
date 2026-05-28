# Assessment / Quiz

## Overview

- **Lesson:** Advanced State Management — Context API and Reducers / 2.6
- **Format:** 10 questions (mix MCQ / True-False)
- **Time:** ~10–15 minutes
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
