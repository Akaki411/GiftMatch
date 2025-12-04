import {
    ADMIN_ROUTE,
    HOME_ROUTE,
    AUTH_ROUTE,
    LOGOUT_ROUTE,
    FAVORITES_ROUTE,
    CART_ROUTE,
    PROFILE_ROUTE,
} from "./utils/consts.js";

import Admin from "./pages/admin/admin.jsx";
import Favorites from "./pages/favorites/favorites.jsx";
import Profile from "./pages/profile/profile.jsx";
import Home from "./pages/home/home.jsx";
import Cart from "./pages/cart/cart.jsx";
import Logout from "./pages/logout/logout.jsx";


export const secureRoutes =
    [
        {
            path: ADMIN_ROUTE,
            Component: <Admin/>
        }
    ]

export const publicRoutes =
    [
        {
            path: HOME_ROUTE,
            Component: <Home/>
        },
        {
            path: AUTH_ROUTE + LOGOUT_ROUTE,
            Component: <Logout/>
        },
        {
            path: FAVORITES_ROUTE,
            Component: <Favorites/>
        },
        {
            path: CART_ROUTE,
            Component: <Cart/>
        },
        {
            path: PROFILE_ROUTE,
            Component: <Profile/>
        }
    ]