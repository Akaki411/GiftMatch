import {AUTH_HOST} from "./index";

export const getAllFavorites = async () => {
    return await AUTH_HOST.get(`/api/favorite`)
}

export const addFavorite = async (id) => {
    return await AUTH_HOST.post(`/api/favorite/${id}`)
}

export const removeFavorite = async (id) => {
    return await AUTH_HOST.delete(`/api/favorite/${id}`)
}