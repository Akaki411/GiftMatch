import {AUTH_HOST, HOST} from "./index";

export const registration = async ({FirstName, LastName, Email, Password}) => {
    return await HOST.post('/api/auth/register', {FirstName, LastName, Email, Password})
}
export const login = async ({Email, Password}) => {
    return await HOST.post('/api/auth/login', {Email, Password})
}

export const check = async () => {
    const token = localStorage.getItem('token')
    if(token)
    {
        return await AUTH_HOST.post('/api/auth/validate', `"${token}"`, {headers: {'Content-Type': 'application/json'}})
    }
    else
    {
        return { isValid: false }
    }
}

export const checkEmail = async ({email}) => {
    return await HOST.post('/api/auth/email', `"${email}"`, {headers: {'Content-Type': 'application/json'}})
}