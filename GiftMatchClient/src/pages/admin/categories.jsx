import React, {useEffect} from 'react';
import AdminHeader from "../../components/admin-header.jsx";
import AdminSearchPlace from "../../components/admin-search-place.jsx";
import {Plus} from "lucide-react"

const Categories = ({
    setChapter = () => {},
    setTitle = () => {}
}) =>
{
    useEffect(() => {
        setChapter("Категории")
        setTitle("Все категории")
    }, [])

    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список категорий">
                <AdminSearchPlace onSearch={text => console.log(text)}/>
                <Plus size={32} color="#aaafb2" />
            </AdminHeader>
            <CategoryBlock/>
        </div>
    )
}

const CategoryBlock = () => {
    return (
        <>
            Здесь будут категории
        </>
    )
}


export default Categories;