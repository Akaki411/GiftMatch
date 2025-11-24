import React from 'react';
import AdminHeader from "../../components/admin-header.jsx";

const Categories = () =>
{
    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список категорий"/>
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