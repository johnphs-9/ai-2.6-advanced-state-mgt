# Pre-Reading: Lesson 2.6, Advanced State Management — Context API and Reducers

Timebox **2–3 hours** across these resources before the lesson. You do not need to memorise everything; focus on building a mental model so the hands-on lab clicks faster.

---

## 1. The Problem: Passing Data Deeply

**Read (15 min)**

- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context): The official React guide to context; covers why prop drilling becomes painful and how a provider solves it. Work through the example — it is short and hands-on.

**Key idea to take away:** Context does not replace props. It is for data that many components at different levels of the tree need — user authentication, themes, and global app state. For data that only a direct parent and child share, props are still the right tool.

---

## 2. Extracting State Logic into a Reducer

**Read (20 min)**

- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer): Explains what a reducer is, how `dispatch` replaces multiple `setState` calls, and the rules a reducer must follow (pure function, no mutations, no side effects).

**Key ideas:**

- A reducer is a plain function: `(state, action) => newState`
- Every action is a plain object with a `type` field and an optional `payload`
- You never mutate state — you always return a new object using the spread operator
- `useReducer` can be used in any component; it is not tied to context

**Quick check:** After reading, can you write a reducer case that adds an item to an array in state without mutating the original?

---

## 3. Scaling Up with Reducer and Context

**Read (20 min)**

- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context): Shows how to combine `useReducer` and `createContext` so that both state and dispatch are accessible anywhere in the component tree. This is the core pattern you will build in the lab.

**Key idea to take away:** Combining context with a reducer is a deliberate choice — you get the centralised state logic of a reducer and the reach of context. But they are independent: you have already seen context with plain `useState` (for auth), and you could use `useReducer` in a single component with no context at all.

---

## 4. Browser Storage

**Read (10 min)**

- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): Read the overview and the basic examples. Focus on `setItem`, `getItem`, and `removeItem`.
- [MDN: Window.sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage): Skim the first two sections. The API is identical to `localStorage` — the difference is only in how long the data persists.

**Key idea to take away:** Both stores save strings only. To store an object, convert it to a string with `JSON.stringify` before saving and convert it back with `JSON.parse` after reading. You can inspect what is stored by opening DevTools and going to **Application > Local Storage**.

---

## 5. When to Use Context

**Read (10 min)**

- [Before You Use Context](https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context): A short section inside the context guide that explains when context is — and is not — the right tool. This helps avoid over-engineering.

**Quick check:** Name one piece of state that belongs in context and one that belongs in local component state.

---

## Reflection (5 min)

Before the lesson, write down answers to these three questions:

1. What is the difference between `localStorage` and `sessionStorage`? Give a scenario where you would choose each.
2. Why must a reducer never mutate its state argument directly?
3. What is one thing you are still unclear about after the pre-reading?

Bring question 3 to class.
