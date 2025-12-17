import {AUTH_HOST, HOST} from "./index";

export const getCategories = async (search) => {
    return await HOST.get(`/api/category${search ? `?searchName=${search}` : ""}`);
}


export const addCategory = async ({title, description, parentId, image}) => {
    let formData = new FormData()
    formData.append("name", title)
    formData.append("description", description)
    if (parentId) formData.append("parentCategoryId", parentId)
    formData.append("image", image)
    return await AUTH_HOST.post("/api/category", formData, {headers: {'Content-Type': 'multipart/form-data'}})
}
