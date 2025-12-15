import {HOST} from "./index";

export const getAllItems = async (limit, page) => {
    return await HOST.get(`/api/product${!!limit || !!page ? "?" : ""}${limit ? `?limit=${limit}` : ""}${!!limit && !!page ? "&" : ""}${page ? `page=${page}` : ""}`);
}