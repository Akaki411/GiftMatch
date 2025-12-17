import React, {useContext, useEffect, useState} from 'react';
import NavBar from "../../components/client-components/nav-bar.jsx";
import SearchBar from "./search-bar.jsx"
import {getCategories} from "../../http/category-api.js";
import {getAllItems} from "../../http/item-api.js";
import {Context} from "../../main.jsx";
import Ident from "../../components/client-components/ident.jsx";
import Carousel from "./carousel.jsx";
import ArrowTitle from "./arrow-title.jsx";
import ItemList from "../../components/client-components/item-list.jsx";
import {observer} from "mobx-react-lite";
import CategoryList from "./category-list.jsx";
import {getAllFavorites} from "../../http/favorites-api.js";
import Popup from "../../components/functional/popup.jsx";
import Product from "../product/product.jsx";

const Home = observer(() => {
    const {categories, items} = useContext(Context)
    const [product, setProduct] = useState(-1);
    useEffect(() => {
        getCategories().then(response => {
            categories.setList(response.data)
        })
        getAllFavorites().then(favourites => {
            items.setFavorites(favourites.data)
        }).finally(() => {
            getAllItems().then(response => {
                items.setList(response.data?.items)
            })
        })

    }, []);

    return (
        <div className="client-wrapper">
            <div className="client-content invisible-scrolling" style={{overflowY: 'scroll'}}>
                <SearchBar />
                <Ident size={100}/>
                <div style={{width:'100%', minHeight:'150px'}}>
                    <Carousel/>
                </div>

                <Ident size={20}/>
                <ArrowTitle title="Категории"/>
                <Ident size={20}/>
                <CategoryList/>
                <Ident size={20}/>
                <ArrowTitle title="Популярное"/>
                <Ident size={20}/>
                <ItemList data={items.list.map((item) => {
                    return {
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        imageUrls: item.imageUrls,
                        isActive: items.isFavourite(item.productId),
                    }
                })}
                    onOpen={key => setProduct(key)}
                />
                <Ident size={80}/>
            </div>
            <Popup isActive={product !== -1} onClose={() => setProduct(-1)} zIndex={11}>
                <Product productId={product}/>
            </Popup>
            <NavBar/>
        </div>
    );
})

export default Home;