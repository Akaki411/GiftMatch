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
import {Plus, Trash2, Edit} from "lucide-react";
import Ident from "../../components/client-components/ident.jsx";
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";
import {addNewItem, getAllItems, removeItem} from "../../http/item-api.js";


const Items = observer(({
   setChapter = () => {},
   setTitle = () => {}
}) => {
    const {items} = useContext(Context)
    const [newItem, setNewItem] = React.useState(false);
    useEffect(() => {
        setChapter("Товары")
        setTitle("Добавить товар")
    }, [])

    const updateItems = () => {
        getAllItems().then(response => {
            items.setList(response.data.items);
            items.setTotal(response.data.totalCount)
        })
    }

    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список товаров">
                <AdminSearchPlace onSearch={text => console.log(text)}/>
                <Plus size={32} color="#aaafb2" onClick={() => setNewItem(true)} style={{cursor: "pointer"}}/>
            </AdminHeader>
            <Ident size={20}/>
            <ItemsList onDelete={updateItems}/>
            <PopupAdmin isActive={newItem} onClose={() => setNewItem(false)}>
                <NewItem onUpdate={updateItems}/>
            </PopupAdmin>
        </div>
    )
})


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
const NewItem = observer(() => {
    const {categories} = useContext(Context)
    const [name, setName] = useState("")
    const [category, setCategory] = useState(null)
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [description, setDescription] = useState(0)
    const [files, setFiles] = useState([])
    const [sending, setSending] = useState(false)

    const SendNewItem = async () =>
    {
        if(name === "" || category === "" || price === 0 || quantity === 0 || description === "" || files.length === 0 || sending)
        {
            alert("Заполните все поля")
            return
        }
        setSending(true)
        addNewItem({
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            description: description,
            files: files,
        }).then(() => {
            setSending(false)
            window.location.reload()
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
                        <AdminSelect
                            style={{ flex: 2, height: "40px"}}
                            placeholder="Категория..."
                            onChange={setCategory}
                            options={categories.list.map((item) => {return {
                                id: item.categoryId,
                                name: item.name
                            }})}
                        />
                        <AdminInput min={0} type="number" placeholder="Цена..."  style={{width:'100px', height: "40px"}} onChange={setPrice}/>
                        <AdminInput min={1} type="number" placeholder="Количество..." style={{width:'100px', height: "40px"}} onChange={setQuantity}/>
                    </div>
                    <div style={descriptionPlace}>
                        <AdminTextArea placeholder="Описание..." onChange={setDescription}/>
                    </div>
                </div>
                <div style={side}>
                    <AdminFileList onSelect={setFiles} />
                </div>
            </div>
            <Ident size={20}/>
            <div className="submit-place" style={{width: '90%'}}>
                 <AdminButton
                     text="Отправить"
                     width="300px"
                     isActive={name !== "" && category !== "" && price !== 0 && quantity !== 0 && description !== "" && files.length !== 0 && !sending}
                     onClick={SendNewItem}
                 />
            </div>
            <Ident size={20}/>
        </AdminFrame>
    );
})

const ItemsList = observer(({
    onUpdate = () => {},
    onDelete = () => {}
}) => {
    const {items} = useContext(Context)
    return (
        <div style={{width:'100%', display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "start"}}>
            {items.list.map((item) => {
                return <BlockItem key={item.productId} product={item} onDelete={onDelete} onEdit={onUpdate}/>
            })}
            <Ident/>
        </div>
    )
})

const itemStyle = {
    container: {
        height: '370px',
        width: '250px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid #aaafb2`,
        position: 'relative',
        borderRadius: '5px',
    },
    active: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '4px 10px',
        boxSizing: 'border-box',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500'
    },
    image: {
        width: '100%',
        height: '230px',
        borderRadius: '8px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    name: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333E4C',
        lineHeight: '1.4'
    },
    description: {
        fontSize: '12px',
        color: '#aaafb2',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    pricePlace: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    price: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827'
    },
    quantityPlace: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: '#374151'
    },
    buttonsPlace: {
        display: 'flex',
        gap: '10px',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '16px',
        marginTop: 'auto'
    },
    editButton: {
        flex: 1,
        padding: '10px 16px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'all 0.2s ease'
    },
    deleteButton: {
        padding: '10px 16px',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'all 0.2s ease'
    }
}

const BlockItem = ({
    product = {},
    onDelete = () => {},
    onEdit = () => {}
}) => {
    const {productId, name, description, price, stockQuantity, isActive, imageUrls = []} = product;

    const remove = () =>
    {
        if(!confirm("Удалить товар?")) return
        removeItem(productId).then(onDelete)
    }

    return (
        <div style={itemStyle.container}>
            <div style={{backgroundColor: isActive ? '#d1fae5' : '#fee2e2', color: isActive ? '#065f46' : '#991b1b', ...itemStyle.active}}>
                {isActive ? 'Активен' : 'Неактивен'}
            </div>
            <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${imageUrls[0]})`, ...itemStyle.image}}/>

            <div style={{display: "flex", flexDirection: "column", rowGap: "10px"}}>
                <h3 style={itemStyle.name}>{name}</h3>
                <p style={itemStyle.description}>{description}</p>
                <div style={itemStyle.pricePlace}>
                    <span style={itemStyle.price}>{price} ₽</span>
                    <div style={itemStyle.quantityPlace}>
                        <span style={{ fontSize: '14px' }}>В наличии:</span>
                        <span style={{fontSize: '14px', fontWeight: 'bold', color: stockQuantity > 0 ? '#059669' : '#dc2626'}}>
                            {stockQuantity} шт.
                        </span>
                    </div>
                </div>
            </div>
            <div style={itemStyle.buttonsPlace}>
                <button
                    onClick={() => onEdit(product)}
                    style={itemStyle.editButton}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                >
                    <Edit size={16} />
                    Редактировать
                </button>
                <button
                    onClick={remove}
                    style={itemStyle.deleteButton}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default Items
