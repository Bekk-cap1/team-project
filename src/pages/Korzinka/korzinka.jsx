import React, { useContext, useEffect, useState } from 'react'
import './korzinka.scss'
import { Context } from '../../assets/Context/Context'
import { listData } from '../../assets/data/data'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Modal } from '@mui/material';

function Basket() {
    const { korzinka, setKorzinka } = useContext(Context)
    const lan = window.localStorage.getItem('language');
    const userId = window.sessionStorage.getItem("userId");
    const [userData, setUserData] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        setCardNumber(formattedValue);
    };

    const handleExpiryDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setExpiryDate(value);
    };

    useEffect(() => {
        fetch("https://638208329842ca8d3c9f7558.mockapi.io/user_data", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ошибка при выполнении запроса");
                }
                return res.json();
            })
            .then((data) => {
                setUserData(data);
                const user = data.find(u => u.id === userId);
                if (user && user.cart) {
                    setKorzinka(user.cart);
                }
            })
            .catch((error) => {
                console.error("Ошибка при выполнении запроса:", error);
            });
    }, [userId, setKorzinka]);

    const removeFromCart = async (cartId) => {
        if (!userId) {
            console.log("Пользователь не авторизован");
            return;
        }

        try {
            // Получаем текущие данные пользователя
            const userResponse = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Ошибка получения данных пользователя');
            }
            
            const userData = await userResponse.json();
            const userCart = userData.cart || [];

            // Удаляем товар из корзины
            const updatedCart = userCart.filter(item => item.cartId !== cartId);

            // Обновляем данные пользователя
            const updateResponse = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    cart: updatedCart
                })
            });

            if (!updateResponse.ok) {
                throw new Error('Ошибка обновления корзины');
            }

            // Обновляем локальное состояние
            setKorzinka(updatedCart);
            setCartItems(updatedCart);
            
            console.log('Товар успешно удален из корзины');

        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
        }
    };

    // Обновим useEffect для периодической синхронизации данных
    useEffect(() => {
        const syncCart = async () => {
            if (userId) {
                try {
                    const response = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`);
                    const userData = await response.json();
                    const userCart = userData.cart || [];
                    setCartItems(userCart);
                    setKorzinka(userCart);
                } catch (err) {
                    console.error('Ошибка синхронизации корзины:', err);
                }
            }
        };

        syncCart();
        // Синхронизируем каждые 5 секунд
        const interval = setInterval(syncCart, 5000);

        return () => clearInterval(interval);
    }, [userId]);

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const user = userData.find(u => u.id === userId);
            if (user) {
                const updatedCart = user.cart.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                );
                
                await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...user,
                        cart: updatedCart
                    })
                });

                setKorzinka(updatedCart);
            }
        } catch (error) {
            console.error('Ошибка при обновлении количества:', error);
        }
    };

    const [deliver, setDeliver] = useState(false)
    const handlePayment = async (event) => {
        event.preventDefault();
        try {
            const user = userData.find(u => u.id === userId);
            if (user) {
                await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...user,
                        cart: []
                    })
                });

                setDeliver(true);
                alert('Оплата успешно завершена! Доставка уже в пути.');
                setKorzinka([]);
                setTimeout(() => setDeliver(false), 5000);
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
        }
    };

    return (
        <div>
            <ul className="basket">
                {korzinka.length !== 0 ?
                    korzinka?.map((e) => (
                        <li key={e.id}>
                            <Swiper
                                spaceBetween={30}
                                centeredSlides={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                navigation={true}
                                modules={[Autoplay, Pagination, Navigation]}
                                className="mySwiper"
                            >
                                {e.images?.map((t) => (
                                    <SwiperSlide key={t.image_id}>
                                        <img src={t.image_url} alt="" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="about_product">
                                <div className='add'>
                                    <button
                                        onClick={() => updateQuantity(e.id, e.quantity - 1)}
                                        disabled={e.quantity === 1}
                                    >
                                        -
                                    </button>
                                    <h6>{e.quantity}</h6>
                                    <button
                                        onClick={() => updateQuantity(e.id, e.quantity + 1)}
                                        disabled={e.quantity === e.stock}
                                    >
                                        +
                                    </button>
                                </div>
                                <h2>{e[`list_name_${lan}`]}</h2>
                                <p>{e[`list_text_${lan}`]}</p>
                                <div className='remove'>
                                    <h3>{e[`price_${lan}`]} : {e.price * e.quantity}сум</h3>
                                    <button data-toggle="modal" data-target="#exampleModal"
                                        className="buy-button"
                                    >
                                        Купить
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(e.cartId)}
                                        className="remove-button"
                                    >
                                        Удалить
                                    </button>
                                </div>

                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Доставка</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="card-container">
                                                    <div className={`card ${isCardFlipped ? 'is-flipped' : ''}`}>
                                                        <div className="card-front">
                                                            <div className="card-number">{cardNumber || '#### #### #### ####'}</div>
                                                            <div className="card-holder">{cardHolder || 'ИМЯ ДЕРЖАТЕЛЯ КАРТЫ'}</div>
                                                            <div className="card-expiry">{expiryDate || 'MM/ГГ'}</div>
                                                        </div>
                                                        <div className="card-back">
                                                            <div className="cvv-strip"></div>
                                                            <div className="cvv-number">{cvv || '***'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <form className="form" onSubmit={handlePayment}>
                                                    <div className="card-input-container">
                                                        <input
                                                            type="text"
                                                            placeholder="Номер карты"
                                                            value={cardNumber}
                                                            onChange={handleCardNumberChange}
                                                            maxLength="19"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="card-input-container">
                                                        <input
                                                            type="text"
                                                            placeholder="Имя держателя карты"
                                                            value={cardHolder}
                                                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="card-input-container">
                                                        <input
                                                            type="text"
                                                            placeholder="MM/ГГ"
                                                            value={expiryDate}
                                                            onChange={handleExpiryDateChange}
                                                            maxLength="5"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="card-input-container">
                                                        <input
                                                            type="password"
                                                            placeholder="CVV"
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                                            onFocus={() => setIsCardFlipped(true)}
                                                            onBlur={() => setIsCardFlipped(false)}
                                                            maxLength="3"
                                                            required
                                                        />
                                                    </div>
                                                    <button type="submit">Оплатить</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                    :
                    <h3 className='bask'>Корзина пуста!</h3>
                }
            </ul>
        </div>
    )
}

export default Basket