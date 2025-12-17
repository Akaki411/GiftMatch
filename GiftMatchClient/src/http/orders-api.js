import {AUTH_HOST} from "./index";

export const getAllOrders = async () => {
    return await AUTH_HOST.get("/api/order")
}
