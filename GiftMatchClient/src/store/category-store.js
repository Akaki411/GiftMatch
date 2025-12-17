import {makeAutoObservable} from "mobx";

export default class CategoryStore
{
    constructor()
    {
        this._categories = []
        this._categoryMap = {}
        this._categoryTree = []
        makeAutoObservable(this)
    }

    createCategoryMap(categories)
    {
        const categoryMap = {}
        categories.forEach(category => {
            categoryMap[category.categoryId] = {...category}
        })
        return categoryMap
    }

    buildCategoryTree(categories)
    {
        const categoryMap = {};
        const rootCategories = [];

        categories.forEach(category => {
            categoryMap[category.categoryId] = {
                ...category,
                children: []
            };
        });

        categories.forEach(category => {
            const node = categoryMap[category.categoryId];

            if (category.parentCategoryId === null)
            {
                rootCategories.push(node);
            }
            else
            {
                const parent = categoryMap[category.parentCategoryId]
                if (parent)
                {
                    parent.children.push(node)
                }
                else
                {
                    rootCategories.push(node)
                }
            }
        });

        return rootCategories;
    }

    setList(value)
    {
        this._categories = value
        this._categoryMap = this.createCategoryMap(value)
        this._categoryTree = this.buildCategoryTree(value)
    }

    get list()
    {
        return this._categories
    }

    get map()
    {
        return this._categoryMap
    }

    get tree()
    {
        return this._categoryTree
    }
}