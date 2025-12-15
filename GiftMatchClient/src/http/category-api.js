import {AUTH_HOST, HOST} from "./index";

export const getCategories = async (search) => {
    return await HOST.get(`/api/category${search ? `?searchName=${search}` : ""}`);
}


export const addCategory = async ({title, parentId, image}) => {
    return await AUTH_HOST.post('/api/user/me', {

    }, {headers: {'Content-Type': 'application/json'}})
}
