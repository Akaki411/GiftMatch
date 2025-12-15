import React, {Component, useContext, useEffect, useState} from "react"
import AdminInput from "../../components/admin-components/admin-input.jsx"
import AdminSelect from "../../components/admin-components/admin-select.jsx"
import AdminTextArea from "../../components/admin-components/admin-text-area.jsx"
import AdminFileList from "../../components/admin-components/admin-file-list.jsx"
import AdminFrame from "../../components/admin-components/admin-frame.jsx";
import AdminHeader from "../../components/admin-components/admin-header.jsx";
import AdminButton from "../../components/admin-components/admin-button.jsx";
import PopupAdmin from "../../components/admin-components/popup-admin.jsx";
import AdminSearchPlace from "../../components/admin-components/admin-search-place.jsx";
import {Plus} from "lucide-react";
import Ident from "../../components/client-components/ident.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";
import {getAllItems} from "../../http/item-api.js";


const Items = observer(({
   setChapter = () => {},
   setTitle = () => {}
}) => {
    const {items} = useContext(Context)
    const [newItem, setNewItem] = React.useState(false);
    useEffect(() => {
        setChapter("Товары")
        setTitle("Добавить товар")
        getAllItems().then(response => {
            items.setList(response.data.items);
            items.setTotal(response.data.totalCount)
        })
    }, [])
    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список товаров">
                <AdminSearchPlace onSearch={text => console.log(text)}/>
                <Plus size={32} color="#aaafb2" onClick={() => setNewItem(true)} style={{cursor: "pointer"}}/>
            </AdminHeader>
            <Ident size={20}/>
            <ItemsList/>
            <PopupAdmin isActive={newItem} onClose={() => setNewItem(false)}>
                <NewItem/>
            </PopupAdmin>
        </div>
    )
})


const NewItem = () => {
    const [name, setName] = useState("")
    const [category, setCategory] = useState(null)
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [description, setDescription] = useState(0)
    const [files, setFiles] = useState(0)

    const main = {
        width: "90%",
        height: "auto",
        display: "flex",
        columnGap: "10px",
        justifyContent: "center",
    }
    const side = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "10px",
    }
    const fontLine = {
        minHeight: "40px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        columnGap: "10px"
    }

    const descriptionPlace = {
        height: "100%",
        width: "100%"
    }

    const SendNewItem = async () =>
    {
        let formData = new FormData()

        formData.append("name", name)
        formData.append("category", category)
        formData.append("price", price)
        formData.append("quantity", quantity)
        formData.append("description", description)
        Object.keys(files).forEach((file) => {
            formData.append("img", files[file])
        })

    }

    return (
        <AdminFrame title="Добавить товар" >
            <Ident size={20}/>
            <div style={main}>
                <div style={side}>
                    <div style={fontLine}>
                        <AdminInput height="40px" style={{ height: "40px", width: "100%"}} onChange={setName} placeholder="Название..."/>
                    </div>
                    <div style={fontLine}>
                        <AdminSelect style={{ flex: 2, height: "40px"}} placeholder="Категория..." onChange={setCategory}/>
                        <AdminInput min={0} type="number" placeholder="Цена..."  style={{width:'100px', height: "40px"}} onChange={setPrice}/>
                        <AdminInput min={1} type="number" placeholder="Количество..." style={{width:'100px', height: "40px"}} onChange={setQuantity}/>
                    </div>
                    <div style={descriptionPlace}>
                        <AdminTextArea placeholder="Описание..." onChange={setDescription}/>
                    </div>
                </div>
                <div style={side}>
                    <AdminFileList onSelect={setFiles}/>
                </div>
            </div>
            <Ident size={20}/>
            <div className="submit-place" style={{width: '90%'}}>
                 <AdminButton text="Отправить" width="300px"/>
            </div>
            <Ident size={20}/>
        </AdminFrame>
    );
}

const ItemsList = observer(() => {
    const {items} = useContext(Context)
    return (
        <div>
            {items.list.map((item) => {
                return <BlockItem key={item.productId} item={item} />
            })}
        </div>
    )
})

const BlockItem = ({
   item = {}
}) =>
{
    return (
        <div>
            {item.name}
        </div>
    )
}


export default Items
