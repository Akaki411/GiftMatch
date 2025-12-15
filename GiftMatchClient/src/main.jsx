import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserStore from "./store/user-store.jsx";
import "./app.css";
import CategoryStore from "./store/category-store.js";
import ItemsStore from "./store/items-store.js";

export const Context = createContext(null);

const container = document.getElementById("root");

let root = container._reactRoot ?? ReactDOM.createRoot(container);
container._reactRoot = root;

root.render(
    <Context.Provider value={{
        user: new UserStore(),
        categories: new CategoryStore(),
        items: new ItemsStore(),
    }}>
        <App />
    </Context.Provider>
);