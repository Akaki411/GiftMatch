import {$host} from "./index";

// User responses
export const registration = async (email, password) => {
    return await $host.post('api/auth/registration', {email, password, role: 'USER'})
}
export const login = async (email, password) => {
    return await $host.post('api/auth/registration', {email, password, role: 'USER'})
}

// Admin responses
export const giveAllPurchases = async (props) => {
    const {data} = await $host.get('api/lists/purchase', {params: props})
    return data
}
export const createSection = async (props) => {
    const {data} = await $host.post('api/catalog/sections', props)
    return data
}
export const createCategory = async (props) => {
    const {data} = await $host.post('api/catalog/types', props)
    return data
}
export const createItem = async (props) => {
    const {data} = await $host.post('api/catalog/item', props)
    return data
}
export const deleteItemById = async (id) => {
    await $host.delete('api/catalog/item' + id)
}
export const deleteSection = async (id) => {
    const {data} = await $host.delete('api/catalog/sections/' + id)
    return data
}
export const deleteType = async (id) => {
    const {data} = await $host.delete('api/catalog/types/' + id)
    return data
}
export const editSection = async (props) => {
    const {data} = await $host.put('api/catalog/sections/' + props.id, props)
    return data
}
export const editType = async (props) => {
    const {data} = await $host.put('api/catalog/types/' + props.id, props)
    return data
}

//Basic responses
export const giveAllCategory = async (props) => {
    const {data} = await $host.get('api/catalog/types', {params: props})
    return data
}
export const giveAllSection = async () => {
    const {data} = await $host.get('api/catalog/sections')
    return data
}
export const giveAllItems = async (props) => {
    const {data} = await $host.get('api/catalog/item', props)
    return data
}

//User responses