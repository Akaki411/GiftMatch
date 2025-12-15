import {makeAutoObservable} from "mobx"

export default class ItemsStore
{
    constructor()
    {
        this._items = []
        this._total = 0
        makeAutoObservable(this)
    }

    setList(value)
    {
        this._items = value
    }

    setTotal(total)
    {
        this._total = total
    }

    get list()
    {
        return this._items
    }

    get total()
    {
        return this._total
    }
}