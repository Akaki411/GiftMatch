import React, {useEffect, useState} from 'react';
import AdminHeader from "../../components/admin-components/admin-header.jsx";
import AdminSearchPlace from "../../components/admin-components/admin-search-place.jsx";
import {getAllUsers} from "../../http/user-api.js";
import Ident from "../../components/client-components/ident.jsx";

const Users = ({
   setChapter = () => {},
   setTitle = () => {}
}) =>
{
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        setChapter("Пользователи")
        setTitle("Все пользователи")
    }, [])

    return (
        <div className="content-block invisible-scrolling">
            <AdminHeader text="Список пользователей">
                <AdminSearchPlace onSearch={setSearchText} onChange={key => {if(key === "") {setSearchText(key)}}}/>
            </AdminHeader>
            <UserBlock search={searchText}/>
        </div>
    )
}


const styles = {
    container: {
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        fontFamily: "Montserrat",
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb',
    },
    list: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        listStyle: 'none',
        padding: '0',
        margin: '0',
        flexWrap: 'wrap',
    },
    userCard: {
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        padding: '20px',
        minWidth: '280px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
    },
    userCardHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    userInfo: {
        textAlign: 'center',
    },
    userName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '8px',
        lineHeight: '1.4',
    },
    userEmail: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '12px',
        wordBreak: 'break-word',
    },
    roleBadge: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    adminRole: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
    },
    userRole: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
    },
    createdAt: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '12px',
        fontStyle: 'italic',
    },
    noUsers: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
        fontSize: '16px',
    },
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const roles = {
    USER: "Пользователь",
    MODER: "Модератор",
    SUPPORT: "Поддержка",
    ADMIN: "Администратор"
}

const UserBlock = ({
    search = ""
}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers({query: search === "" ? null : search}).then(response => {
            setUsers(response.data)
        })
    }, [search])

    if (users.length === 0)
    {
        return (
            <div style={styles.container}>
                <div style={styles.noUsers}>Пользователи не найдены</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.list}>
                {users.map((user) => (
                    <div
                        key={user.userId}
                        style={styles.userCard}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = styles.userCardHover.transform;
                            e.currentTarget.style.boxShadow = styles.userCardHover.boxShadow;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = styles.userCard.boxShadow;
                        }}>
                        <div style={styles.avatarContainer}>
                            <div style={{background: `url(${import.meta.env.VITE_APP_API_URL}/${user.avatarUrl ? user.avatarUrl : "uploads/avatars/avatar.webp"})`, ...styles.avatar}}/>
                        </div>

                        <div style={styles.userInfo}>
                            <h3 style={styles.userName}>
                                {user.firstName} {user.lastName}
                            </h3>
                            <p style={styles.userEmail}>{user.email}</p>
                            <div style={{...styles.roleBadge, ...(user.role === 'ADMIN' ? styles.adminRole : styles.userRole)}}>{roles[user.role]}</div>
                            <div style={styles.createdAt}>Создан: {formatDate(user.createdAt)}</div>
                        </div>
                    </div>
                ))}
                <Ident size={120}/>
            </div>
        </div>
    );
}


export default Users;