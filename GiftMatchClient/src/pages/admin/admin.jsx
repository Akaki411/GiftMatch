import React, {useEffect} from 'react';
import './admin.css'
import Purchases from "./purchases.jsx"
import Items from "./items.jsx"
import {Gift, LayoutList, List, UserCog} from "lucide-react"

const Admin = () =>
{
    const [state, setState] = React.useState("purchases")
    const [chapter, setChapter] = React.useState("Покупки")
    const [title, setTitle] = React.useState("Список последних")

    const buttons = {
        purchases: {id: 1, logo: Gift, title:"Заказы", element: <Purchases/>},
        products: {id: 2, logo: LayoutList, title:"Товары", element: <Items/>},
        categories: {id: 3, logo: List, title:"Категории", element: <Purchases/>},
        users: {id: 4, logo: UserCog, title:"Пользователи", element: <Purchases/>},
    }

    useEffect(() => {
        document.title = "GiftMatch ADMIN"
    }, [])


    const MoveCursor = (moveTo) =>
    {
        const topMargin = -53 + buttons[moveTo].id * 100
        const color = buttons[moveTo].id === 1 ? "#ECF0F1" : "#FFFFFF"
        return {top: topMargin + "px", backgroundColor: color}
    }

    return (
        <div className="wrapper">
            <div className="head dontSelectable">
                <h1>GiftMatch ADMIN</h1>
            </div>
            <div className="content">
                <div className="panel">
                    <div className="menu invisible-scrolling dontSelectable">
                        <div className="cursor" style={MoveCursor(state)}/>
                        {
                            Object.keys(buttons).map((name) => {
                            return(
                                <MenuCell btn={buttons[name]} isActive={state === name} key={name} fn={() => {setState(name)}}/>
                            )
                        })}
                    </div>
                    <div className="container">
                        <div className="panelHead dontSelectable" style={{display: "flex", columnGap: "10px"}}>
                            <div className="highlightedGreen">{chapter}</div>
                            <div>/</div>
                            <div>{title}</div>
                        </div>
                        <div className="main invisible-scrolling">
                            {
                                buttons[state].element
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

const MenuCell = ({
    btn = {},
    fn = () => {},
    isActive = false
}) => {
    return(
        <div className='menu_btn' onClick={fn}>
            {<btn.logo  size={36} color={isActive ? "#1DC19F" : "#ffffff"}/>}
            <p style={{color: isActive ? "#1DC19F" : "#ffffff"}}>{btn.title}</p>
            {btn.marker && <div className="redMarker"/>}
        </div>
    );
};

export default Admin;