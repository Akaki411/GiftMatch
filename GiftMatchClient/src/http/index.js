import axios from "axios";

const HOST = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL
})

const AUTH_HOST = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL
})

const authIntercepter = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

AUTH_HOST.interceptors.request.use(authIntercepter)

export {
    HOST,
    AUTH_HOST
}