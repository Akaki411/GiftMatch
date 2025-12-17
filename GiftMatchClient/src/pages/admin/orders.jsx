import React, {useEffect} from 'react';
import AdminHeader from "../../components/admin-components/admin-header.jsx";
import {getAllOrders} from "../../http/orders-api.js";


const styles = {
    container: {
        fontFamily: "Montserrat",
        height: '100%',
        width: '100%',
        padding: '20px 0',
        boxSizing: 'border-box',
        color: '#333'
    },
    header: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        marginBottom: '25px',
        borderBottom: '3px solid #4a6bff'
    },
    title: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#2c3e50',
        margin: '0 0 10px 0'
    },
    subtitle: {
        fontSize: '14px',
        color: '#7f8c8d',
        margin: '0'
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #eef2f7',
        width: '100%'
    },
    orderCardHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
    },
    orderHeader: {
        backgroundColor: '#f8fafc',
        padding: '18px 20px',
        borderBottom: '1px solid #eef2f7',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
    },
    orderId: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50'
    },
    statusBadge: {
        padding: '6px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    statusProcessing: {
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeaa7'
    },
    orderBody: {
        padding: '20px'
    },
    orderInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    orderInfoRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        alignItems: 'flex-start'
    },
    infoBlock: {
        flex: '1',
        minWidth: '200px'
    },
    infoSection: {
        marginBottom: '15px'
    },
    label: {
        fontSize: '12px',
        color: '#95a5a6',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '5px',
        display: 'block'
    },
    value: {
        fontSize: '15px',
        color: '#2c3e50',
        fontWeight: '500'
    },
    trackingNumber: {
        backgroundColor: '#f1f8ff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontFamily: "'Courier New', monospace",
        fontSize: '14px',
        color: '#0366d6',
        display: 'inline-block'
    },
    amount: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#27ae60'
    },
    itemsSection: {
        marginTop: '25px',
        borderTop: '1px solid #eef2f7',
        paddingTop: '20px'
    },
    itemsTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '15px'
    },
    itemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    itemCard: {
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        padding: '15px',
        borderLeft: '4px solid #4a6bff'
    },
    itemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        flexWrap: 'wrap',
        gap: '10px'
    },
    productName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2c3e50'
    },
    itemPrice: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#27ae60'
    },
    itemDetails: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        fontSize: '14px',
        color: '#7f8c8d'
    },
    footer: {
        backgroundColor: '#f8fafc',
        padding: '15px 20px',
        borderTop: '1px solid #eef2f7',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        color: '#95a5a6',
        flexWrap: 'wrap',
        gap: '10px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.05)'
    },
    emptyIcon: {
        fontSize: '48px',
        color: '#bdc3c7',
        marginBottom: '20px'
    },
    emptyText: {
        fontSize: '18px',
        color: '#7f8c8d',
        marginBottom: '10px'
    },
    emptySubtext: {
        fontSize: '14px',
        color: '#bdc3c7'
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusStyle = (status) => {
    switch(status) {
        case 'В обработке':
            return { ...styles.statusBadge, ...styles.statusProcessing };
        case 'Доставлен':
            return { ...styles.statusBadge, backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
        case 'Отменен':
            return { ...styles.statusBadge, backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
        case 'В пути':
            return { ...styles.statusBadge, backgroundColor: '#cce5ff', color: '#004085', border: '1px solid #b8daff' };
        default:
            return styles.statusBadge;
    }
};

const Orders = ({
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
            <OrdersList/>
        </div>
    )
}

const OrdersList = () => {
    const [orders, setOrders] = React.useState([])

    useEffect(() => {
        getAllOrders().then(response => {
            setOrders(response.data.items)
        })
    }, [])

    return (
        <div style={styles.container}>
            {orders.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptySubtext}>Нет активных заказов для отображения</div>
                </div>
            ) : (
                <div style={styles.ordersList}>
                    {orders.map(order => (
                        <OrderCard key={order.orderId} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}

const OrderCard = ({ order }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            style={{
                ...styles.orderCard,
                ...(isHovered && styles.orderCardHover)
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.orderHeader}>
                <div style={styles.orderId}>Заказ #{order.orderId}</div>
                <div style={getStatusStyle(order.status)}>{order.status}</div>
            </div>

            <div style={styles.orderBody}>
                <div style={styles.orderInfo}>
                    <div style={styles.orderInfoRow}>
                        <div style={styles.infoBlock}>
                            <div style={styles.infoSection}>
                                <span style={styles.label}>Пользователь</span>
                                <div style={styles.value}>ID: {order.userId}</div>
                            </div>
                        </div>

                        <div style={styles.infoBlock}>
                            <div style={styles.infoSection}>
                                <span style={styles.label}>Трек-номер</span>
                                <div style={styles.trackingNumber}>{order.trackingNumber}</div>
                            </div>
                        </div>

                        <div style={styles.infoBlock}>
                            <div style={styles.infoSection}>
                                <span style={styles.label}>Общая сумма</span>
                                <div style={styles.amount}>{order.totalAmount.toFixed(2)} ₽</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.orderInfoRow}>
                        <div style={styles.infoBlock}>
                            <div style={styles.infoSection}>
                                <span style={styles.label}>Телефон</span>
                                <div style={styles.value}>{order.phone}</div>
                            </div>
                        </div>

                        <div style={{ flex: 2, minWidth: '300px' }}>
                            <div style={styles.infoSection}>
                                <span style={styles.label}>Адрес доставки</span>
                                <div style={styles.value}>{order.deliveryAddress}</div>
                            </div>
                        </div>
                    </div>

                    {order.notes && (
                        <div style={styles.infoBlock}>
                            <div style={styles.infoSection}>
                                <span style={styles.label}>Примечания</span>
                                <div style={styles.value}>{order.notes}</div>
                            </div>
                        </div>
                    )}
                </div>

                {order.items && order.items.length > 0 && (
                    <div style={styles.itemsSection}>
                        <div style={styles.itemsTitle}>Товары в заказе ({order.items.length})</div>
                        <div style={styles.itemsList}>
                            {order.items.map(item => (
                                <OrderItem key={item.orderItemId} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={styles.footer}>
                <div>Создан: {formatDate(order.createdAt)}</div>
                <div>Обновлен: {formatDate(order.updatedAt)}</div>
            </div>
        </div>
    );
};

const OrderItem = ({ item }) => (
    <div style={styles.itemCard}>
        <div style={styles.itemHeader}>
            <div style={styles.productName}>{item.productName}</div>
            <div style={styles.itemPrice}>{item.subtotal.toFixed(2)} ₽</div>
        </div>
        <div style={styles.itemDetails}>
            <div>Кол-во: {item.quantity} шт.</div>
            <div>Цена: {item.price.toFixed(2)} ₽</div>
            {item.discount > 0 && (
                <div>Скидка: {item.discount.toFixed(2)} ₽</div>
            )}
        </div>
    </div>
);





export default Orders;