import React, {createContext} from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import UserStore from "./store/user-store.jsx";
import "./app.css"

export const Context = createContext(null)

createRoot(document.getElementById('root')).render(
    <Context.Provider value={{
        user: new UserStore()
    }}>
        <App/>
    </Context.Provider>,
);