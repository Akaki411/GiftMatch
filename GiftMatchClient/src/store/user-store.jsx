import {makeAutoObservable} from "mobx";

export default class UserStore
{
    constructor()
    {
        this._isAdmin = true
        this._isAuth = true
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

    setIsAdmin(value)
    {
        this._isAdmin = value
    }

    get isAuth()
    {
        return this._isAuth
    }

    get user()
    {
        return this._user
    }

    get isAdmin()
    {
        return this._isAdmin
    }
}