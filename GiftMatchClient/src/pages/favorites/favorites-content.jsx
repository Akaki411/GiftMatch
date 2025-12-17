import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {getAllFavorites} from "../../http/favorites-api.js";
import {Context} from "../../main.jsx";
import Ident from "../../components/client-components/ident.jsx";
import ItemList from "../../components/client-components/item-list.jsx";

const FavoritesContent = observer(({
   onOpen = () => {}
}) => {
    const {items} = useContext(Context);

    useEffect(() => {
        getAllFavorites().then(response => {
            items.setFavorites(response.data);
        })
    }, []);
    return (
        <div className="client-wrapper">
            <div className="client-content">
                <Ident size={20}/>
                <ItemList data={items.favorites} onOpen={onOpen}/>
            </div>
        </div>
    );
})

export default FavoritesContent;