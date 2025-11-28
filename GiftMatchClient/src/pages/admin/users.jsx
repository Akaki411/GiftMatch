import React, {useEffect} from 'react';
import AdminHeader from "../../components/admin-components/admin-header.jsx";
import AdminSearchPlace from "../../components/admin-components/admin-search-place.jsx";

const Users = ({
   setChapter = () => {},
   setTitle = () => {}
}) =>
{
    useEffect(() => {
        setChapter("Пользователи")
        setTitle("Все пользователи")
    }, [])

    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список пользователей">
                <AdminSearchPlace onSearch={text => console.log(text)}/>
            </AdminHeader>
            <UserBlock/>
        </div>
    )
}

const UserBlock = () => {
    return (
        <>
            Здесь будут пользователи
        </>
    )
}

export default Users;