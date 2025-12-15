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

    normalizeCategoryTree(categories)
    {
        const seenIds = new Set();
        const result = [];

        const processNode = (node) =>
        {
            if (seenIds.has(node.categoryId))
            {
                return null
            }
            seenIds.add(node.categoryId)
            const newNode = {
                categoryId: node.categoryId,
                name: node.name,
                description: node.description,
                imageUrl: node.imageUrl,
                children: []
            }
            if (node.children && node.children.length > 0)
            {
                node.children.forEach(child => {
                    const processedChild = processNode(child)
                    if (processedChild)
                    {
                        newNode.children.push(processedChild)
                    }
                })
            }
            return newNode
        }
        categories.forEach(category => {
            const processed = processNode(category)
            if (processed)
            {
                result.push(processed)
            }
        })
        return result
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