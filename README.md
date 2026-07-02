# 2.6 Advanced State Management - Context API and Reducers

## Lesson Overview

This lesson solves the prop drilling problem that emerges as the CRM app grows. Learners use the Context API to make shared state available anywhere in the component tree, then replace multi-`useState` logic with `useReducer` for predictable, action-based updates. The two tools are combined into an `AuthContext` and a `CustomerContext` backed by a reducer, before the lesson closes with role-based rendering and guidance on when to reach for context versus props. Persisting the logged-in user to `localStorage` is left for learners to add independently in the assignment.

## Dependencies

- [Self Studies](./studies.md)
- [Lesson](./lesson.md)
- [Assignment](./assignment.md)

## Lesson Objectives

- Use the Context API to share state across components without prop drilling
- Use `useReducer` to manage complex state transitions through explicit, action-based updates
- Combine Context and `useReducer` into a shared store and apply role-based rendering to show different UI to different users

## Lesson Plan

| Duration  | What                                        | How or Why                                                                                                                    |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 10 min    | Warm up and recap                           | Recap Lesson 2.5: useEffect and API calls; show the grown App.jsx as motivation for avoiding prop drilling                     |
| 30 min    | Slides: Context API and useReducer          | Prop drilling problem, createContext/Provider/useContext pattern, useState vs useReducer, action types and dispatch, when to combine them, when to prefer props |
| 5 min     | Break                                       |                                                                                                                                |
| 5 min     | Code-along: see the problem                 | Read App.jsx together; count useState calls; trace handleDeleteCustomer and handleUpdateCustomer through the component tree   |
| 40 min    | Code-along: AuthContext for login           | Build AuthContext with login, logout, and hasRole; create LoginPage and Header; gate the CRM behind the login screen          |
| 30 min    | Code-along: customer reducer                | Decide which state belongs in the reducer; write customerReducer; replace the four coupled useState calls in App.jsx          |
| 5 min     | Break                                       |                                                                                                                                |
| 25 min    | Code-along: CustomerContext and role-based UI | Move the reducer and handlers into CustomerContext; refactor CustomerCard and CustomerDetail to consume context directly       |
| 15 min    | Activity: role badge in the header          | Learners add a role-based badge to Header using AuthContext, styled with CSS Modules                                          |
| 15 min    | Wrap up and Q&A                             | Performance notes on context re-renders, when to use context vs props, common mistakes, preview Lesson 2.8                    |
| **Total** |                                              | **180 min (3 hours), following the standard lesson format**                                                                    |
