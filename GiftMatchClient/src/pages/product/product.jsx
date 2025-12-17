import React, {useEffect} from 'react';
import {getItem} from "../../http/item-api.js";
import Ident from "../../components/client-components/ident.jsx";
import BlackButton from "../../components/client-components/black-button.jsx";
import Line from "../../components/client-components/line.jsx";
import {addToCart} from "../../http/cart-api.js";
import ImageCarousel from "./image-carousel.jsx";
import {ClimbingBoxLoader} from "react-spinners";


const productStyles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'scroll',
    },
    image: {
        width: '100%',
        height: '400px',
        backgroundColor: 'gray',
    },
    name: {
        width: '100%',
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    },
    price: {
        width: '100%',
        fontSize: '16px',
        fontFamily: 'Montserrat',
    },
    toCart: {
        width: '90%',
        position: 'fixed',
        bottom: "120px",
    },
    description: {
        width: '100%',
        fontSize: '16px',
        fontFamily: 'Montserrat',
        color: 'gray',
    }
}

const Product = ({
    productId = -1
}) => {
    const [product, setProduct] = React.useState({})
    const [isBuy, setIsBuy] = React.useState(false)

    useEffect(() => {
        getItem(productId).then(response => {
            setProduct(response.data)
        })
    }, []);

    const buyProduct = () => {
        setIsBuy(true)
        addToCart({
            productId: product.productId,
            quantity: 1,
        }).then(() => {
            setTimeout(() => setIsBuy(false), 500)
        })
    }

    if (Object.keys(product).length === 0)
    {
        return (
            <div className="client-content">
                <Ident size={50}/>
                <ClimbingBoxLoader size={20} color="black"/>
                <Ident size={20}/>
                Загрузка
            </div>
        )
    }

    return (
        <div style={productStyles.container} className="invisible-scrolling">
            <ImageCarousel imageUrls={product.imageUrls} />
            <Ident size={20}/>
            <div style={{width: '90%', display: 'flex', flexDirection: 'column', rowGap: "10px"}}>
                <div style={productStyles.name}>{product.name}</div>
                <div style={productStyles.price}>{product.price} p.</div>
                <Line/>
                <div style={productStyles.description}>
                    {product.description}
                </div>
            </div>
            <div style={productStyles.toCart}>
                <BlackButton text="В корзину" isActive={!isBuy} onClick={buyProduct} />
            </div>
        </div>
    );
};

export default Product;