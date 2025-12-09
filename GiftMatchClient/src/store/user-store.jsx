import {makeAutoObservable} from "mobx";

export default class UserStore
{
    constructor()
    {
        this._role = "UNAUTHORIZED"
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(value)
    {
        this._isAuth = value
    }

    setUser(value)
    {
        this._user = value
    }

    setRole(value)
    {
        this._role = value
    }

    get isAuth()
    {
        return this._isAuth
    }

    get user()
    {
        return this._user
    }

    get role()
    {
        return this._role
    }
}