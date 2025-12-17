import {makeAutoObservable} from "mobx"
import {useLayoutEffect} from "react";

export default class ItemsStore
{
    constructor()
    {
        this._items = []
        this._favorites = []
        this._favoriteIds = []
        this._total = 0
        makeAutoObservable(this)
    }

    setList(value)
    {
        this._items = value
    }

    setFavorites(value)
    {
        this._favorites = value
        this._favoriteIds = value.map(key => (key.productId))
    }

    setTotal(total)
    {
        this._total = total
    }

    isFavourite(id)
    {
        return this._favoriteIds.includes(id)
    }

    get list()
    {
        return this._items
    }

    get total()
    {
        return this._total
    }

    get favorites()
    {
        return this._favorites
    }

    get favoriteIds()
    {
        return this._favoriteIds
    }
}