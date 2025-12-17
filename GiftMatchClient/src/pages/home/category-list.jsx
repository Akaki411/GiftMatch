import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../main.jsx";

const container = {
    width: "100%",
    minHeight: "120px",
    display: "flex",
    alignItems: "center",
    columnGap: "25px",
    overflowX: "scroll",
}
const CategoryList = observer(() => {
    const {categories} = useContext(Context);
    return (
        <div style={container} className="invisible-scrolling">
            {categories.list.map(category => {
                return <CategoryBlock key={category.categoryId} category={category} />;
            })}
        </div>
    );
})

const block = {
    width: "80px",
    height: "120px",
}
const image = {
    width: "80px",
    height: "80px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    borderRadius: "50%",
}
const name = {
    width: "80px",
    textAlign: "center",
    fontSize: "14px",
    fontFamily: "Montserrat",
}
const CategoryBlock = ({
   category = {}
}) => {
    return (
        <div style={block}>
            <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${category.imageUrl})`, ...image}}/>
            <div style={name}>{category.name}</div>
        </div>
    )
}

export default CategoryList;