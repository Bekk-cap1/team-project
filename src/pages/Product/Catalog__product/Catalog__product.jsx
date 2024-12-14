import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../../components/Header/Header'
import './Catalog__product.scss'
import logo from '../../../assets/image/logo.png'
import { Context } from '../../../assets/Context/Context'
import { opisanie } from '../../../assets/data/data'
import Footer from '../../../components/Footer/Footer'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';

function Catalog__product() {
    const catRef = useRef()
    const [url_img, setUrl_img] = useState(0)
    const [product, setProduct] = useState(1)
    const [id, setId] = useState()
    const [listData, setListData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const local = useLocation()
    const navig = local.pathname.split('/products/').join('')

    const lan = window.localStorage.getItem('language')

    const [searchData, setSearchData] = useState()

    const userId = window.sessionStorage.getItem("userId");

    const navigate = useNavigate()
    const [userData, setUserData] = useState([]);
    const listHome = searchData?.length ? searchData : listData.slice(-15, -5);
    const user = userData.find((e) => e.id === userId);

    // Получение данных товаров через API
    useEffect(() => {
        setIsLoading(true)
        fetch("https://638208329842ca8d3c9f7558.mockapi.io/team-project", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ошибка при получении данных товаров");
                }
                return res.json();
            })
            .then((data) => {
                setListData(data);
                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Ошибка при получении данных товаров:", error);
                setIsLoading(false)
            });
    }, []);

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
            })
            .catch((error) => {
                console.error("Ошибка при выполнении запроса:", error);
            });
    }, []);

    const { korzinka, setKorzinka } = useContext(Context);
    
    useEffect(() => {
    }, [korzinka]);

    const pushKorzinka = (id) => {
        setKorzinka((prevKorzinka) => {
            const itemExists = prevKorzinka.some((item) => item.id === id);
            if (itemExists) {
                console.log("Этот элемент уже существует в корзине");
                return prevKorzinka;
            } else {
                const itemToAdd = searchData?.length ? searchData.find((item) => item.id === id) : listData.find((item) => item.id === id);
                if (itemToAdd) {
                    console.log("Элемент добавлен в корзину:", itemToAdd);
                    return [...prevKorzinka, { ...itemToAdd, quantity: 1 }];
                }
            }
            return prevKorzinka;
        });
    };

    if (isLoading) {
        return (
            <div className="loading2">
                <div className="spinner"></div>
                <p>Загрузка...</p>
            </div>
        )
    }

    return (
        <>
            <div className='header__product'>
                <div className="container">
                    <div className="product__inner">
                        <div>
                            <div className='product__right'>
                                {
                                    listData?.map((e, i) => (
                                        navig == e.id ?
                                            <img src={e.images[url_img].image_url} alt="" />
                                            : ''
                                    ))
                                }
                            </div>
                            <div className='product__main'>
                                {
                                    listData?.map((e, i) => (
                                        navig == e.id ?
                                            <>
                                                <h2>{e[`list_name_${lan}`]}</h2>
                                                <span className='stocks'>
                                                    <h6>{e[`stock_${lan}`]}: <strong>{e.stock}</strong></h6>
                                                </span>
                                                <hr />
                                                {
                                                    opisanie?.map((q) => (
                                                        <h3>
                                                            {q[`name_${lan}`]}
                                                        </h3>
                                                    ))
                                                }
                                                <p>{e[`list_text_${lan}`]}</p>
                                                <hr />
                                                <span>
                                                    <h2>{e[`price_${lan}`]}:</h2>
                                                    <b>{e.price} сум</b>
                                                </span>
                                            </> : ''
                                    ))
                                }
                                <div>
                                    <span className='span__div'>
                                        {
                                            listData?.map((e) => (
                                                navig == e.id ?
                                                    <>
                                                        {
                                                            user ?
                                                                <button onClick={(event) => {
                                                                    event.stopPropagation()
                                                                    pushKorzinka(e.id)
                                                                }}>{korzinka.some((item) => item.id === e.id)
                                                                    ? 'Товар в корзине'
                                                                    : 'Добавить в корзину'}
                                                                    <i className={korzinka.some((item) => item.id === e.id) ? "bi bi-cart-check" : "bi bi-cart-plus"}></i>
                                                                </button> : <button onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    navigate('/signin');
                                                                }}> {korzinka.some((item) => item.id === e.id)
                                                                    ? 'Товар в корзине'
                                                                    : 'Добавить в корзину'}
                                                                    <i className={korzinka.some((item) => item.id === e.id) ? "bi bi-cart-check" : "bi bi-cart-plus"}></i>
                                                                </button>
                                                        }
                                                    </>
                                                    : ''
                                            ))
                                        }
                                    </span>
                                </div>
                                <hr />
                                <div className='podel'>
                                    <h5>Поделиться</h5>
                                    <img src={logo} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Catalog__product
