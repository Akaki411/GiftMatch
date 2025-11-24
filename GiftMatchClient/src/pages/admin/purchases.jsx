import React from 'react';
import AdminHeader from "../../components/admin-header.jsx";

function Purchases()
{
    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список заказов"/>
            <PurchaseBlock/>
        </div>
    )
}

const PurchaseBlock = () => {
    return (
        <>
            Здесь будут заказы
        </>
    )
}

export default Purchases;