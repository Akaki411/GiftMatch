import {AUTH_HOST, HOST} from "./index";

export const getAllItems = async (limit, page) => {
    return await HOST.get(`/api/product${!!limit || !!page ? "?" : ""}${limit ? `?limit=${limit}` : ""}${!!limit && !!page ? "&" : ""}${page ? `page=${page}` : ""}`);
}

export const getItem = async (id) => {
    return await HOST.get("/api/product/" + id)
}

export const addNewItem = async ({name, category, price, quantity, description, files}) => {
    let formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("price", price)
    formData.append("stockQuantity", quantity)
    formData.append("description", description)
    files.forEach((file) => {
        formData.append("images", file)
    })
    return await AUTH_HOST.post("/api/product/", formData, {headers: {'Content-Type': 'multipart/form-data'}})
}

export const removeItem = async (id) => {
    return await AUTH_HOST.delete("/api/product/" + id)
}
