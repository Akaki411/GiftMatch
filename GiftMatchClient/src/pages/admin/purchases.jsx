import React, {useEffect} from 'react';
import AdminHeader from "../../components/admin-components/admin-header.jsx";

const Purchases = ({
    setChapter = () => {},
    setTitle = () => {}
}) =>
{
    useEffect(() => {
        setChapter("Покупки")
        setTitle("Список последних")
    }, [])
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