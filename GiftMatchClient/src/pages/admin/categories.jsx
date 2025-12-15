import React, {useContext, useEffect, useState} from 'react';
import AdminHeader from "../../components/admin-components/admin-header.jsx";
import AdminSearchPlace from "../../components/admin-components/admin-search-place.jsx";
import {Camera, Pencil, Plus, Trash} from "lucide-react"
import PopupAdmin from "../../components/admin-components/popup-admin.jsx";
import AdminInput from "../../components/admin-components/admin-input.jsx";
import AdminSelect from "../../components/admin-components/admin-select.jsx";
import Ident from "../../components/client-components/ident.jsx";
import AdminFileInput from "../../components/admin-components/admin-file-input.jsx";
import AdminButton from "../../components/admin-components/admin-button.jsx";
import {addCategory} from "../../http/category-api.js";
import {Context} from "../../main.jsx";
import {observer} from "mobx-react-lite";
import AdminTextArea from "../../components/admin-components/admin-text-area.jsx";

const Categories = observer(({
    setChapter = () => {},
    setTitle = () => {}
}) => {
    const [newCategory, setNewCategory] = React.useState(false);
    useEffect(() => {
        setChapter("Категории")
        setTitle("Все категории")
    }, [])

    return (
        <div className="content-block invisible-scrolling" style={{height: "100%"}}>
            <AdminHeader text="Список категорий">
                <AdminSearchPlace onSearch={text => console.log(text)}/>
                <Plus size={32} color="#aaafb2" onClick={() => setNewCategory(true)} style={{cursor: "pointer"}}/>
            </AdminHeader>
            <CategoryTreeView/>
            <PopupAdmin isActive={newCategory} onClose={() => setNewCategory(false)}>
                <AddCategoryBlock/>
            </PopupAdmin>
        </div>
    )
})

const addBlock = {
    width: "400px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: "10px",
}
const fieldBlock = {
    width: "90%",
    height: "40px",
}
const imageBlock = {
    width: "90%",
    height: "250px",
}

const AddCategoryBlock = ({
    callback = () => {}
}) => {
    const [category, setCategory] = React.useState("")
    const [parent, setParent] = React.useState(null)
    const [image, setImage] = React.useState(null)

    const createCategory = () => {
        if(category !== "" && image !== null)
        {
            alert("Для создания категории подарка необходимо название категории и ее иллюстрация.")
            return
        }
        addCategory({
            title: category,
            parentId: parent,
            image: image,
        }).then(response => {

        })
    }

    return(
        <div style={addBlock}>
            <Ident/>
            <div style={fieldBlock}>
                <AdminInput style={{width:"100%"}} placeholder="Название категории..." onChange={setCategory}/>
            </div>
            <div style={fieldBlock}>
                <AdminSelect style={{width:"100%"}} placeholder="Родительская категория..." onChange={setParent}/>
            </div>
            <div style={{width: "90%"}}>
                <AdminTextArea style={{width:"100%", height: "80px"}} placeholder="Описание категории..." onChange={setParent}/>
            </div>
            <div style={imageBlock}>
                <AdminFileInput onSelect={setImage}/>
            </div>
            <div style={fieldBlock}>
                <AdminButton text="Отправить" isActive={category !== "" && image !== null}/>
            </div>
        </div>
    )
}

const container = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    rowGap: "10px",
}
const CategoryTreeView = observer(() => {
    const {categories} = useContext(Context)

    if (categories.tree.length === 0) return <div style={container}>Категории не добавлены</div>

    return (
        <div style={container}>
            <Ident size={30}/>
            {
                categories.tree.map(category => {
                    return (<CategoryItem
                        key={category.categoryId}
                        category={category}
                        level={0}
                    />)
                })
            }
        </div>
    );
})

const categoryCard = {
    width: '100%',
    backgroundColor: 'white',
    padding: '10px',
    boxSizing: 'border-box',
    borderLeft: '3px solid #aaafb2',
    background: '#F9F9F9',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    marginTop: '10px',
}
const categoryHeader = {
    height: '40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}
const categoryOptions = {
    display: 'flex',
    alignItems: "center",
    columnGap: '10px',
}
const CategoryItem = ({ category, level = 0 }) => {
    const hasChildren = category.children.length > 0;


    return (
        <div style={categoryCard}>
            <div style={categoryHeader}>
                <div>
                    <p style={{fontSize: '14px', color: '#333E4C'}}>{category.name}</p>
                    <p style={{color: '#aaafb2',fontSize: '10px',}}>{category.description}</p>
                </div>
                <div style={categoryOptions}>
                    <Pencil size={16} color="#333E4C"/>
                    <Camera size={18} color="#333E4C"/>
                    <Trash  size={16} color="#333E4C"/>
                </div>
            </div>
            {hasChildren && (
                <div style={{marginLeft: '10px'}}>
                    {category.children.map(child => (
                        <CategoryItem
                            key={child.categoryId}
                            category={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


export default Categories;