import {AUTH_HOST} from "./index";

export const getAllCartItems = async () => {
    return await AUTH_HOST.get(`/api/cart`)
}

export const addToCart = async ({productId, quantity}) => {
    return await AUTH_HOST.post(`/api/cart/items`, {productId, quantity}, {headers: {'Content-Type': 'application/json'}})
}

export const removeFromCart = async (id) => {
    return await AUTH_HOST.delete(`/api/cart/items/${id}`)
}

export const checkout = async ({deliveryAddress, phone, notes}) => {
    return await AUTH_HOST.post(`/api/cart/checkout`, {deliveryAddress, phone, notes}, {headers: {'Content-Type': 'application/json'}})
}