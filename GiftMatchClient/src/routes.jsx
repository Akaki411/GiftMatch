import {
    ADMIN_ROUTE,
    HOME_ROUTE,
    AUTH_ROUTE,
    REGISTRATION_ROUTE,
    LOGIN_ROUTE,
    LOGOUT_ROUTE,
    FAVORITES_ROUTE,
    CART_ROUTE,
    PROFILE_ROUTE,
    WISHLIST_ROUTE
} from "./utils/consts.js";

import Empty from "./pages/empty/empty.jsx";
import Admin from "./pages/admin/admin.jsx";

export const secureRoutes =
    [
        {
            path: ADMIN_ROUTE,
            Component: <Empty/>
        }
    ]

export const authRoutes =
    [
        {
            path: FAVORITES_ROUTE,
            Component: <Empty/>
        },
        {
            path: CART_ROUTE,
            Component: <Empty/>
        },
        {
            path: PROFILE_ROUTE,
            Component: <Empty/>
        },
        {
            path: WISHLIST_ROUTE,
            Component: <Empty/>
        }
    ]

export const publicRoutes =
    [
        {
            path: HOME_ROUTE,
            Component: <Admin/>
        },
        {
            path: AUTH_ROUTE + REGISTRATION_ROUTE,
            Component: <Empty/>
        },
        {
            path: AUTH_ROUTE + LOGIN_ROUTE,
            Component: <Empty/>
        },
        {
            path: AUTH_ROUTE + LOGOUT_ROUTE,
            Component: <Empty/>
        }
    ]