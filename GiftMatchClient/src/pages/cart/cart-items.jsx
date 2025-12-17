import React from 'react';
import {Trash} from "lucide-react";
import {removeFromCart} from "../../http/cart-api.js";

const styles = {
    container: {
        width: "100%",
        fontFamily: 'Montserrat',
        margin: '20px auto',
        borderBottom: '1px solid #E6E6E6',
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerRow: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto',
        gap: '20px',
        marginBottom: '20px',
        fontSize: '16px',
        fontWeight: '500',
        width: '90%',
    },
    font: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Montserrat",
        fontWeight: "bold",
    },
    itemRow: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto',
        gap: '20px',
        marginBottom: '20px',
        alignItems: 'start',
        width: '90%',
    },
    imageContainer: {
        width: '100px',
        height: '100px',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
    },
    descriptionColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingTop: '5px',
    },
    title: {
        fontSize: '16px',
        margin: 0,
        lineHeight: '1.4',
    },
    quantity: {
        fontSize: '16px',
        margin: 0,
        color: '#000',
    },
    priceColumn: {
        paddingTop: '5px',
        fontSize: '16px',
        whiteSpace: 'nowrap',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        rowGap: '15px',
    }
}

const CartItems = ({
    items = [],
    onOpen = () => {},
}) => {
    return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <div style={styles.font}>Предметы</div>
                <div style={styles.font}>Описание</div>
                <div style={{textAlign: 'right', ...styles.font}}>Цена</div>
            </div>
            {items.map((item) => (<Item key={item.cartItemId} item={item} onOpen={onOpen} />))}
        </div>
    );
};

const Item = ({
    item = {},
    onOpen = () => {}
}) => {

    const remove = () => {
        removeFromCart(item.cartItemId).then(() => {
            window.location.reload();
        })
    }

    return (
        <div style={styles.itemRow}>
            <div style={styles.imageContainer}>
                <div
                    style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${item.product.imageUrls[0]})`, ...styles.image}}
                    onClick={() => {onOpen(item.product.productId)}}
                />
            </div>
            <div style={styles.descriptionColumn}>
                <h3 style={styles.title} onClick={() => {onOpen(item.product.productId)}}>{item.product.name}</h3>
                <p style={styles.quantity}>Количество: {item.quantity}</p>
            </div>
            <div style={styles.priceColumn}>
                {item.product.price} р.
                <Trash size={18} color="#aaafb2" onClick={remove}/>
            </div>
        </div>
    )
}

export default CartItems;