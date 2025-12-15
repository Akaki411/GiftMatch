import {AUTH_HOST} from "./index";

export const editUser = async ({FirstName, LastName, Email, Password, NewPassword}) => {
    return await AUTH_HOST.put('/api/user/me', {
        FirstName,
        LastName,
        Email,
        Password,
        NewPassword: NewPassword ? NewPassword : null,
    }, {headers: {'Content-Type': 'application/json'}})
}

export const changeAvatar = async ({Image}) => {
    const formData = new FormData()
    formData.append('file', Image)
    return await AUTH_HOST.post('/api/image/avatar', formData, {headers: {'Content-Type': "multipart/form-data"}})
}