import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";
import {Heart} from "lucide-react"
import {addFavorite, removeFavorite} from "../../http/favorites-api.js";

const container = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: '20px',
    columnGap: '20px',
}
const ItemList = ({
    data = [],
    onOpen = () => {},
}) => {
    return (
        <div style={container}>
            {data.map(item => {
                return <BlockItem
                    key={item.productId}
                    productId={item.productId}
                    name={item.name}
                    price={item.price}
                    imageUrls={item.imageUrls}
                    isActive={item.isActive}
                    onOpen={onOpen}
                />
            })}
        </div>
    );
};

const block = {
    position: 'relative',
    width: '150px',
    height: '240px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: "5px"
}
const image = {
    width: '150px',
    height: '150px',
    backgroundSize: 'cover',
    borderRadius: '10px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
}
const infoLine = {
    width: '100%',
    height: 'auto',
    maxHeight: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
}
const BlockItem = observer(({
    productId = -1,
    name = "Название",
    price = 0,
    imageUrls = ["uploads/images/default.webp"],
    isActive = false,
    onOpen = () => {},
}) => {
    const {user} = useContext(Context)
    const [isFavorite, setIsFavorite] = useState(isActive)
    const favourite = () => {
        if(isFavorite)
        {
            removeFavorite(productId).then(() => {
                setIsFavorite(false)
            })
        }
        else
        {
            addFavorite(productId).then(() => {
                setIsFavorite(true)
            })
        }
    }
    return (
        <div style={block}>
            <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${imageUrls[0]})`,...image}} onClick={() => {onOpen(productId)}}/>
            <div style={{fontFamily: "Montserrat",...infoLine}} onClick={() => {onOpen(productId)}}>
                {name}
            </div>
            <div style={{fontFamily: "Montserrat", fontSize: "20px", fontWeight: "bold",...infoLine}}>
                {price} ₽
                {user.role !== "UNAUTHORIZED" && (
                    <Heart
                        size={16}
                        color={isFavorite ? "#D23341" : "#787878"}
                        strokeWidth={2}
                        onClick={() => favourite(productId)}
                        style={{position: "absolute", right: 10}}
                    />)}
            </div>
        </div>
    )
})

export default ItemList;