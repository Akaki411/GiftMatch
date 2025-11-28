import React, {Component, useEffect, useState} from "react"
import AdminInput from "../../components/admin-input.jsx"
import AdminSelect from "../../components/admin-select.jsx"
import RoundTextArea from "../../components/roundTextArea"
import AdminFileList from "../../components/admin-file-list.jsx"
import AdminFrame from "../../components/admin-frame.jsx";
import AdminHeader from "../../components/admin-header.jsx";


const Items = ({
   setChapter = () => {},
   setTitle = () => {}
}) =>
{
    useEffect(() => {
        setChapter("Товары")
        setTitle("Добавить товар")
    }, []);
    return (
        <div className="content-block invisible-scrolling">
            <NewItem/>
            <AllItems/>
        </div>
    )
}


const NewItem = () => {
    const [name, setName] = useState("")
    const [category, setCategory] = useState(null)
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [description, setDescription] = useState(0)
    const [files, setFiles] = useState(0)


    const secondLine = {
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
            <div className="blockContent">
                <div className="add-item-information">
                    <div style={secondLine}>
                        <AdminInput height="40px" style={{ height: "40px", width: "100%"}} onChange={setName} placeholder="Название..."/>
                    </div>
                    <div style={secondLine}>
                        <AdminSelect style={{ flex: 2 }} placeholder="Категория..." onChange={setCategory}/>
                        <AdminInput min={0} type="number" placeholder="Цена..."  style={{width:'100px'}} onChange={setPrice}/>
                        <AdminInput min={1} type="number" placeholder="Количество..." style={{width:'100px'}} onChange={setQuantity}/>
                    </div>
                    <div style={descriptionPlace}>
                        <RoundTextArea placeholder="Описание..." onChange={setDescription}/>
                    </div>
                </div>
                <AdminFileList onSelect={setFiles}/>
            </div>
            <div className="submit-place">
                <input type="button" value="Отправить" className="submit hover sendForm" />
            </div>
        </AdminFrame>
    );
}


const AllItems = () => {
    return (
        <div style={{width:'100%', display: "flex", flexDirection: "column", alignItems: "center"}}>
            <AdminHeader text="Список товаров"/>
            <ItemBlock/>
        </div>
    )
}

const ItemBlock = () => {
    return (
        <>
            Здесь будут товары
        </>
    )
}


export default Items
