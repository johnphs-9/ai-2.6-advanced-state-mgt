# 2.6 Advanced State Management - Context API and Reducers

## Lesson Overview

This lesson solves the prop drilling problem that emerges as the CRM app grows. Learners use the Context API to make shared state available anywhere in the component tree, then replace multi-`useState` logic with `useReducer` for predictable, action-based updates. The two tools are combined into an `AuthContext` with localStorage persistence and a `CustomerContext` backed by a reducer, before the lesson closes with role-based rendering and guidance on when to reach for context versus props.

## Dependencies

- [Self Studies](./studies.md)
- [Lesson](./lesson.md)
- [Assignment](./assignment.md)

## Lesson Objectives

- Use the Context API to share state across components without prop drilling
- Use `useReducer` to manage complex state transitions through explicit, action-based updates
- Combine Context and `useReducer` into a shared store and apply role-based rendering to show different UI to different users

## Lesson Plan

| Duration  | What                                           | How or Why                                                                                                           |
| --------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 10 min    | Warm up and recap                              | Recap Lesson 2.5: useEffect and API calls; show the grown App.jsx as motivation for avoiding prop drilling           |
| 20 min    | Context API                                    | Slides: prop drilling problem, createContext/Provider/useContext pattern, AuthContext with localStorage persistence   |
| 15 min    | useReducer and the context+reducer pattern     | Slides: useState vs useReducer, action types and dispatch, combining a context with a reducer for a shared store     |
| 5 min     | Break                                          |                                                                                                                      |
| 5 min     | Code-along: project setup                      | Confirm starting point; walk through target file structure before writing any code                                   |
| 35 min    | Code-along: AuthContext with persistence       | Build AuthContext with login and logout actions; persist user to localStorage; consume in a login gate component     |
| 20 min    | Code-along: customer reducer                   | Define CRM state shape and action types; write and test the customer reducer; verify transitions with dispatch calls |
| 5 min     | Break                                          |                                                                                                                      |
| 30 min    | Code-along: CustomerContext and CRM UI         | Wrap the app in CustomerContext; refactor components to consume context; add role-based UI for admin vs viewer       |
| 15 min    | Wrap up and Q&A                                | Performance notes on context re-renders, when to use context vs props, common mistakes, preview Lesson 2.8          |
| **Total** |                                                | **160 min — allows ~20 min buffer for questions and pacing**                                                         |
